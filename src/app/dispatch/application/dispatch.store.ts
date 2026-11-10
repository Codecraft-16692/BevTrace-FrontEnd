import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { BaseStore } from '../../shared/application/base-store';
import { BusinessError } from '../../shared/domain/model/business-error';

import { DeliveryDestination } from '../domain/model/delivery-destination.entity';
import { Driver } from '../domain/model/driver.entity';
import { TransportVehicle } from '../domain/model/transport-vehicle.entity';
import { DispatchOrder } from '../domain/model/dispatch-order.entity';
import { CargoAssignment } from '../domain/model/cargo-assignment.entity';
import { ScheduleDispatchCommand } from '../domain/model/schedule-dispatch.command';
import { AssignVehicleCommand } from '../domain/model/assign-vehicle.command';
import { ValidateCargoCommand } from '../domain/model/validate-cargo.command';
import { RegisterDepartureCommand } from '../domain/model/register-departure.command';
import { ChangeDispatchPriorityCommand } from '../domain/model/change-dispatch-priority.command';

import { DispatchApi } from '../infrastructure/dispatch-api';
import { InventoryApi } from '../../inventory/infrastructure/inventory-api';
import { ProductBatch } from '../../inventory/domain/model/product-batch.entity';

/**
 * Signal-based application store for the Dispatch bounded context.
 *
 * @remarks
 * This store manages the dispatch queue and enforces the rules of the user
 * stories: stock availability when scheduling, vehicle capacity and
 * availability when assigning, pallet validation against the order and the
 * departure preconditions. The departure deducts the stock and starts the
 * route traceability.
 */
@Injectable({ providedIn: 'root' })
export class DispatchStore extends BaseStore {
  /**
   * API facade used to reach the dispatch endpoints.
   */
  private readonly api = inject(DispatchApi);

  /**
   * API facade used to read and update the stock of the batches.
   */
  private readonly inventoryApi = inject(InventoryApi);

  /**
   * Internal signal containing the destinations.
   */
  private readonly destinationsSignal = signal<DeliveryDestination[]>([]);

  /**
   * Internal signal containing the drivers.
   */
  private readonly driversSignal = signal<Driver[]>([]);

  /**
   * Internal signal containing the vehicles.
   */
  private readonly vehiclesSignal = signal<TransportVehicle[]>([]);

  /**
   * Internal signal containing the dispatch orders.
   */
  private readonly ordersSignal = signal<DispatchOrder[]>([]);

  /**
   * Internal signal containing the cargo assignments.
   */
  private readonly cargoSignal = signal<CargoAssignment[]>([]);

  /**
   * Internal signal containing the batches available in the warehouse.
   */
  private readonly batchesSignal = signal<ProductBatch[]>([]);

  /**
   * Readonly signal exposing the destinations.
   */
  readonly destinations = this.destinationsSignal.asReadonly();

  /**
   * Readonly signal exposing the drivers.
   */
  readonly drivers = this.driversSignal.asReadonly();

  /**
   * Readonly signal exposing the vehicles.
   */
  readonly vehicles = this.vehiclesSignal.asReadonly();

  /**
   * Readonly signal exposing every cargo assignment.
   */
  readonly cargo = this.cargoSignal.asReadonly();

  /**
   * Readonly signal exposing the dispatch orders, highest priority and earliest date first.
   */
  readonly orders = computed(() => {
    const weight = { URGENT: 0, LOGISTICS: 1, STANDARD: 2 };
    return [...this.ordersSignal()].sort(
      (a, b) => weight[a.priority] - weight[b.priority] || a.scheduledDate.localeCompare(b.scheduledDate),
    );
  });

  /**
   * Orders waiting to leave the warehouse.
   */
  readonly queue = computed(() =>
    this.orders().filter((order) => order.status === 'SCHEDULED' || order.status === 'AUTHORIZED'),
  );

  /**
   * Orders currently on the road.
   */
  readonly inTransit = computed(() => this.orders().filter((order) => order.status === 'IN_TRANSIT'));

  /**
   * Orders already delivered.
   */
  readonly delivered = computed(() => this.orders().filter((order) => order.status === 'DELIVERED'));

  /**
   * Vehicles that can be assigned to a dispatch.
   */
  readonly availableVehicles = computed(() =>
    this.vehiclesSignal().filter((vehicle) => vehicle.isAvailable),
  );

  /**
   * Batches with stock that can still be requested.
   */
  readonly dispatchableBatches = computed(() =>
    this.batchesSignal().filter((batch) => batch.status === 'AVAILABLE' && this.freeStock(batch) > 0),
  );

  /**
   * Loads every dispatch collection.
   */
  loadAll(): void {
    this.read(this.snapshot$(), 'dispatch.errors.load', (snapshot) => this.applySnapshot(snapshot));
  }

  /**
   * Returns an order by identifier.
   *
   * @param orderId - Identifier of the order
   * @returns The matching order or undefined
   */
  orderById(orderId: number): DispatchOrder | undefined {
    return this.ordersSignal().find((order) => order.id === orderId);
  }

  /**
   * Returns the cargo assignments of an order.
   *
   * @param orderId - Identifier of the order
   * @returns Cargo assignments of the order
   */
  cargoOf(orderId: number): CargoAssignment[] {
    return this.cargoSignal().filter((item) => item.dispatchOrderId === orderId);
  }

  /**
   * Calculates the units of a batch that are not reserved by pending dispatches.
   *
   * @param batch - Batch to evaluate
   * @returns Units that can still be requested
   */
  freeStock(batch: ProductBatch): number {
    const pendingIds = new Set(
      this.ordersSignal()
        .filter((order) => order.status === 'SCHEDULED' || order.status === 'AUTHORIZED')
        .map((order) => order.id),
    );
    const reserved = this.cargoSignal()
      .filter((item) => item.batchId === batch.id && pendingIds.has(item.dispatchOrderId))
      .reduce((sum, item) => sum + item.quantity, 0);
    return Math.max(0, batch.currentQty - reserved);
  }

  /**
   * Schedules a dispatch order. The backend validates the date and the free stock and
   * computes the weight and the pallets.
   *
   * @param command   - Scheduling command
   * @param onCreated - Optional callback with the identifier of the created order
   */
  scheduleDispatch(command: ScheduleDispatchCommand, onCreated?: (orderId: number) => void): void {
    if (command.items.length === 0) {
      this.startOperation();
      this.failOperation(new BusinessError('dispatch.errors.no-items'), '');
      return;
    }

    this.write(
      this.api.scheduleOrder({
        destinationId: command.destinationId,
        scheduledDate: command.scheduledDate,
        priority: command.priority,
        items: command.items.map((item) => ({ batchId: item.batchId, quantity: item.quantity })),
      }),
      'dispatch.errors.generic',
      (order) => {
        this.refresh();
        onCreated?.(order.id);
      },
      { key: 'dispatch.form.success' },
    );
  }

  /**
   * Assigns a vehicle and authorizes the order.
   *
   * @param command - Vehicle assignment command
   */
  assignVehicle(command: AssignVehicleCommand): void {
    this.write(
      this.api.assignVehicle(command.dispatchOrderId, command.vehicleId),
      'dispatch.errors.generic',
      () => this.refresh(),
      { key: 'dispatch.detail.vehicle-assigned' },
    );
  }

  /**
   * Validates the scanned pallets against the loaded cargo.
   *
   * @param command - Cargo validation command
   */
  validateCargo(command: ValidateCargoCommand): void {
    const scannedPallets = Array.from(
      new Set(command.scannedPallets.map((code) => code.trim().toUpperCase()).filter((code) => code)),
    );
    this.write(
      this.api.validateCargo(command.dispatchOrderId, scannedPallets),
      'dispatch.errors.generic',
      () => this.refresh(),
      { key: 'dispatch.detail.cargo-validated' },
    );
  }

  /**
   * Changes the priority of a scheduled or authorized order.
   *
   * @param command - Priority change command
   */
  changePriority(command: ChangeDispatchPriorityCommand): void {
    this.write(
      this.api.changePriority(command.dispatchOrderId, command.priority),
      'dispatch.errors.generic',
      () => this.refresh(),
      { key: 'dispatch.detail.priority-updated' },
    );
  }

  /**
   * Registers the departure. The backend deducts the stock and starts the traceability.
   *
   * @param command - Departure command
   */
  registerDeparture(command: RegisterDepartureCommand): void {
    this.write(
      this.api.registerDeparture(command.dispatchOrderId),
      'dispatch.errors.generic',
      () => this.refresh(),
      { key: 'dispatch.detail.departed' },
    );
  }

  /**
   * Cancels a scheduled or authorized order. The backend releases the vehicle.
   *
   * @param orderId - Identifier of the order
   */
  cancelOrder(orderId: number): void {
    this.write(this.api.cancelOrder(orderId), 'dispatch.errors.generic', () => this.refresh(), {
      key: 'dispatch.detail.cancelled',
    });
  }

  /**
   * Builds the observable that retrieves every dispatch collection.
   *
   * @returns Observable emitting the whole dispatch snapshot
   */
  private snapshot$(): Observable<{
    destinations: DeliveryDestination[];
    drivers: Driver[];
    vehicles: TransportVehicle[];
    orders: DispatchOrder[];
    cargo: CargoAssignment[];
    batches: ProductBatch[];
  }> {
    return forkJoin({
      destinations: this.api.getDestinations(),
      drivers: this.api.getDrivers(),
      vehicles: this.api.getVehicles(),
      orders: this.api.getOrders(),
      cargo: this.api.getCargo(),
      batches: this.inventoryApi.getBatches(),
    });
  }

  /**
   * Stores a snapshot in the signals of the store.
   *
   * @param snapshot - Dispatch snapshot retrieved from the API
   */
  private applySnapshot(snapshot: {
    destinations: DeliveryDestination[];
    drivers: Driver[];
    vehicles: TransportVehicle[];
    orders: DispatchOrder[];
    cargo: CargoAssignment[];
    batches: ProductBatch[];
  }): void {
    this.destinationsSignal.set(snapshot.destinations);
    this.driversSignal.set(snapshot.drivers);
    this.vehiclesSignal.set(snapshot.vehicles);
    this.ordersSignal.set(snapshot.orders);
    this.cargoSignal.set(snapshot.cargo);
    this.batchesSignal.set(snapshot.batches);
  }

  /**
   * Reloads the dispatch data silently after a write operation.
   */
  private refresh(): void {
    this.snapshot$().subscribe((snapshot) => this.applySnapshot(snapshot));
  }
}
