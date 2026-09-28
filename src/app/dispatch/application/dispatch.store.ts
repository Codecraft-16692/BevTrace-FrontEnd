import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { defer, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';

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
import { TraceabilityStore } from '../../traceability/application/traceability.store';
import { IncidentStore } from '../../incident/application/incident.store';

/**
 * Average weight in kilograms of a beverage unit, used to estimate the cargo weight.
 */
const KG_PER_UNIT = 1.1;

/**
 * Units that fit in a pallet, used to calculate the pallets of a cargo.
 */
const UNITS_PER_PALLET = 400;

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
   * Injector used to reach other bounded contexts lazily.
   */
  private readonly injector = inject(Injector);

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
   * Schedules a dispatch order after validating the stock of every batch.
   *
   * @param command - Command containing the destination, date, priority and items
   * @param onCreated - Callback executed with the identifier of the created order
   */
  scheduleDispatch(command: ScheduleDispatchCommand, onCreated?: (orderId: number) => void): void {
    const operation = defer(() => {
      const today = new Date().toISOString().split('T')[0];
      if (command.scheduledDate < today) {
        return throwError(() => new BusinessError('dispatch.errors.past-date'));
      }
      if (command.items.length === 0) {
        return throwError(() => new BusinessError('dispatch.errors.no-items'));
      }

      for (const item of command.items) {
        const batch = this.batchesSignal().find((candidate) => candidate.id === item.batchId);
        if (!batch || batch.status !== 'AVAILABLE') {
          return throwError(() => new BusinessError('dispatch.errors.batch-unavailable'));
        }
        const free = this.freeStock(batch);
        if (item.quantity <= 0 || item.quantity > free) {
          return throwError(
            () => new BusinessError('dispatch.errors.stock-insufficient', { code: batch.batchNumber, available: free }),
          );
        }
      }

      const total = command.items.reduce((sum, item) => sum + item.quantity, 0);

      return this.api
        .createOrder({
          managerId: command.managerId,
          vehicleId: null,
          destinationId: command.destinationId,
          scheduledDate: command.scheduledDate,
          status: 'SCHEDULED',
          priority: command.priority,
          estimatedWeight: Math.round(total * KG_PER_UNIT * 10) / 10,
          requestedQuantity: total,
          deliveredQuantity: null,
          deliveredAt: null,
          departedAt: null,
          cargoValidated: false,
          createdAt: new Date().toISOString(),
        })
        .pipe(
          switchMap((order) =>
            forkJoin(
              command.items.map((item) =>
                this.api.createCargo({
                  dispatchOrderId: order.id,
                  batchId: item.batchId,
                  quantity: item.quantity,
                  totalWeight: Math.round(item.quantity * KG_PER_UNIT * 10) / 10,
                  palletCount: Math.max(1, Math.ceil(item.quantity / UNITS_PER_PALLET)),
                }),
              ),
            ).pipe(map(() => order)),
          ),
        );
    });

    this.write(
      operation,
      'dispatch.errors.generic',
      (order) => {
        this.refresh();
        onCreated?.(order.id);
      },
      { key: 'dispatch.form.success' },
    );
  }

  /**
   * Assigns a vehicle to a scheduled dispatch, which authorizes it.
   *
   * @param command - Command containing the order and the vehicle
   */
  assignVehicle(command: AssignVehicleCommand): void {
    const operation = defer(() => {
      const order = this.orderById(command.dispatchOrderId);
      const vehicle = this.vehiclesSignal().find((item) => item.id === command.vehicleId);
      if (!order || order.status !== 'SCHEDULED') {
        return throwError(() => new BusinessError('dispatch.errors.not-scheduled'));
      }
      if (!vehicle || !vehicle.isAvailable) {
        return throwError(
          () => new BusinessError('dispatch.errors.vehicle-unavailable', { plate: vehicle?.plateNumber ?? '-' }),
        );
      }
      const driver = this.driversSignal().find((item) => item.id === vehicle.driverId);
      if (!driver || driver.status !== 'ACTIVE') {
        return throwError(() => new BusinessError('dispatch.errors.driver-unavailable'));
      }
      if (order.estimatedWeight > vehicle.maxCapacity) {
        return throwError(
          () =>
            new BusinessError('dispatch.errors.capacity-exceeded', {
              weight: order.estimatedWeight,
              capacity: vehicle.maxCapacity,
            }),
        );
      }

      return this.api
        .updateOrder(order.id, { vehicleId: vehicle.id, status: 'AUTHORIZED' })
        .pipe(switchMap((updated) => this.api.setVehicleAvailable(vehicle.id, false).pipe(map(() => updated))));
    });

    this.write(
      operation,
      'dispatch.errors.generic',
      (order) => {
        this.injector.get(IncidentStore).notify({
          recipientRole: 'ROLE_WAREHOUSE_OPERATOR',
          type: 'DISPATCH',
          title: 'Dispatch authorized',
          message: `Dispatch #${order.id} to ${order.destinationName} was authorized. Validate the pallets before departure.`,
        });
        this.refresh();
      },
      { key: 'dispatch.detail.vehicle-assigned' },
    );
  }

  /**
   * Validates the loaded pallets against the pallets expected by the order.
   *
   * @param command - Command containing the order and the scanned pallet labels
   */
  validateCargo(command: ValidateCargoCommand): void {
    const operation = defer(() => {
      const order = this.orderById(command.dispatchOrderId);
      if (!order || order.status !== 'AUTHORIZED') {
        return throwError(() => new BusinessError('dispatch.errors.not-authorized'));
      }

      const expected = this.cargoOf(order.id).flatMap((item) => item.palletCodes);
      const scanned = Array.from(
        new Set(command.scannedPallets.map((code) => code.trim().toUpperCase()).filter((code) => code)),
      );
      const unexpected = scanned.filter((code) => !expected.includes(code));
      const missing = expected.filter((code) => !scanned.includes(code));

      if (unexpected.length > 0 || missing.length > 0) {
        return throwError(
          () =>
            new BusinessError('dispatch.errors.pallet-mismatch', {
              unexpected: unexpected.length > 0 ? unexpected.join(', ') : '-',
              missing: missing.length > 0 ? missing.join(', ') : '-',
            }),
        );
      }
      return this.api.updateOrder(order.id, { cargoValidated: true });
    });

    this.write(operation, 'dispatch.errors.generic', () => this.refresh(), {
      key: 'dispatch.detail.cargo-validated',
    });
  }

  /**
   * Changes the operational priority of a pending dispatch.
   *
   * @param command - Command containing the order and the new priority
   */
  changePriority(command: ChangeDispatchPriorityCommand): void {
    const operation = defer(() => {
      const order = this.orderById(command.dispatchOrderId);
      if (!order || (order.status !== 'SCHEDULED' && order.status !== 'AUTHORIZED')) {
        return throwError(() => new BusinessError('dispatch.errors.not-editable'));
      }
      return this.api.updateOrder(order.id, { priority: command.priority });
    });

    this.write(operation, 'dispatch.errors.generic', () => this.refresh(), {
      key: 'dispatch.detail.priority-updated',
    });
  }

  /**
   * Registers the departure: deducts the stock and starts the route traceability.
   *
   * @param command - Command containing the order
   */
  registerDeparture(command: RegisterDepartureCommand): void {
    const operation = defer(() => {
      const order = this.orderById(command.dispatchOrderId);
      if (!order || order.status !== 'AUTHORIZED' || order.vehicleId === null) {
        return throwError(() => new BusinessError('dispatch.errors.not-authorized'));
      }
      if (!order.cargoValidated) {
        return throwError(() => new BusinessError('dispatch.errors.cargo-not-validated'));
      }

      const departedAt = new Date().toISOString();
      const deductions = this.cargoOf(order.id).map((item) => {
        const batch = this.batchesSignal().find((candidate) => candidate.id === item.batchId);
        const remaining = Math.max(0, (batch?.currentQty ?? 0) - item.quantity);
        return this.inventoryApi.updateBatch(item.batchId, {
          currentQty: remaining,
          status: remaining === 0 ? 'DEPLETED' : 'AVAILABLE',
        });
      });

      const stockUpdates: Observable<unknown> = deductions.length > 0 ? forkJoin(deductions) : of([]);
      const destination = this.destinationsSignal().find((item) => item.id === order.destinationId);
      const vehicle = this.vehiclesSignal().find((item) => item.id === order.vehicleId);

      return this.api.updateOrder(order.id, { status: 'IN_TRANSIT', departedAt }).pipe(
        switchMap((updated) => stockUpdates.pipe(map(() => updated))),
        switchMap((updated) =>
          this.injector
            .get(TraceabilityStore)
            .startRouteTraceability({
              dispatchOrderId: updated.id,
              priority: updated.priority,
              destinationName: updated.destinationName,
              destinationLatitude: destination?.latitude ?? updated.destinationLatitude,
              destinationLongitude: destination?.longitude ?? updated.destinationLongitude,
              vehiclePlate: vehicle?.plateNumber ?? updated.vehiclePlate,
              vehicleId: order.vehicleId as number,
              departedAt,
            })
            .pipe(map(() => updated)),
        ),
      );
    });

    this.write(operation, 'dispatch.errors.generic', () => this.refresh(), {
      key: 'dispatch.detail.departed',
    });
  }

  /**
   * Cancels a pending dispatch and releases its vehicle.
   *
   * @param orderId - Identifier of the order
   */
  cancelOrder(orderId: number): void {
    const operation = defer(() => {
      const order = this.orderById(orderId);
      if (!order || (order.status !== 'SCHEDULED' && order.status !== 'AUTHORIZED')) {
        return throwError(() => new BusinessError('dispatch.errors.not-editable'));
      }
      const release: Observable<unknown> =
        order.vehicleId !== null ? this.api.setVehicleAvailable(order.vehicleId, true) : of(null);
      return this.api
        .updateOrder(order.id, { status: 'CANCELLED' })
        .pipe(switchMap((updated) => release.pipe(map(() => updated))));
    });

    this.write(operation, 'dispatch.errors.generic', () => this.refresh(), {
      key: 'dispatch.detail.cancelled',
    });
  }

  /**
   * Closes a dispatch order once its delivery was confirmed by the traceability context.
   *
   * @remarks
   * Returns an observable so the traceability store can chain it after
   * registering the delivery record.
   *
   * @param orderId - Identifier of the delivered order
   * @returns Observable emitting the updated order
   */
  completeDelivery(orderId: number): Observable<DispatchOrder> {
    return this.api.getOrderById(orderId).pipe(
      switchMap((order) =>
        this.api
          .updateOrder(order.id, {
            status: 'DELIVERED',
            deliveredAt: new Date().toISOString(),
            deliveredQuantity: order.requestedQuantity,
          })
          .pipe(
            switchMap((updated) =>
              order.vehicleId !== null
                ? this.api.setVehicleAvailable(order.vehicleId, true).pipe(map(() => updated))
                : of(updated),
            ),
          ),
      ),
    );
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
