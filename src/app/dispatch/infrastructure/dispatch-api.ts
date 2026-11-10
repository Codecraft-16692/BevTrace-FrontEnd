import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';

import { DeliveryDestination } from '../domain/model/delivery-destination.entity';
import { Driver } from '../domain/model/driver.entity';
import { TransportVehicle } from '../domain/model/transport-vehicle.entity';
import { DispatchOrder } from '../domain/model/dispatch-order.entity';
import { CargoAssignment } from '../domain/model/cargo-assignment.entity';

import { DeliveryDestinationApiEndpoint } from './delivery-destination-api-endpoint';
import { DriverApiEndpoint } from './driver-api-endpoint';
import { TransportVehicleApiEndpoint } from './transport-vehicle-api-endpoint';
import { DispatchOrderApiEndpoint } from './dispatch-order-api-endpoint';
import { CargoAssignmentApiEndpoint } from './cargo-assignment-api-endpoint';

import { ScheduleDispatchOrderRequest } from './dispatch-order.request';

/**
 * HTTP API facade for the Dispatch bounded context.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over destination, driver, vehicle,
 * dispatch order and cargo assignment endpoint clients.
 */
@Injectable({ providedIn: 'root' })
export class DispatchApi extends BaseApi {
  /**
   * Endpoint client for delivery destinations.
   */
  private readonly destinationEndpoint: DeliveryDestinationApiEndpoint;

  /**
   * Endpoint client for drivers.
   */
  private readonly driverEndpoint: DriverApiEndpoint;

  /**
   * Endpoint client for transport vehicles.
   */
  private readonly vehicleEndpoint: TransportVehicleApiEndpoint;

  /**
   * Endpoint client for dispatch orders.
   */
  private readonly orderEndpoint: DispatchOrderApiEndpoint;

  /**
   * Endpoint client for cargo assignments.
   */
  private readonly cargoEndpoint: CargoAssignmentApiEndpoint;

  /**
   * Creates a new DispatchApi facade.
   *
   * @param http - Angular HttpClient used by endpoint clients
   */
  constructor(http: HttpClient) {
    super();
    this.destinationEndpoint = new DeliveryDestinationApiEndpoint(http);
    this.driverEndpoint = new DriverApiEndpoint(http);
    this.vehicleEndpoint = new TransportVehicleApiEndpoint(http);
    this.orderEndpoint = new DispatchOrderApiEndpoint(http);
    this.cargoEndpoint = new CargoAssignmentApiEndpoint(http);
  }

  /**
   * Retrieves every delivery destination.
   *
   * @returns Observable stream emitting DeliveryDestination entities
   */
  getDestinations(): Observable<DeliveryDestination[]> {
    return this.destinationEndpoint.getAll();
  }

  /**
   * Retrieves every driver.
   *
   * @returns Observable stream emitting Driver entities
   */
  getDrivers(): Observable<Driver[]> {
    return this.driverEndpoint.getAll();
  }

  /**
   * Retrieves every transport vehicle.
   *
   * @returns Observable stream emitting TransportVehicle entities
   */
  getVehicles(): Observable<TransportVehicle[]> {
    return this.vehicleEndpoint.getAll();
  }


  /**
   * Retrieves every dispatch order.
   *
   * @returns Observable stream emitting DispatchOrder entities
   */
  getOrders(): Observable<DispatchOrder[]> {
    return this.orderEndpoint.getAll();
  }

  /**
   * Retrieves a dispatch order by identifier.
   *
   * @param id - Identifier of the order
   * @returns Observable stream emitting the DispatchOrder
   */
  getOrderById(id: number): Observable<DispatchOrder> {
    return this.orderEndpoint.getById(id);
  }

  /**
   * Schedules a dispatch order (POST /dispatch-orders).
   *
   * @param request - Destination, date, priority and requested batches
   * @returns Observable emitting the created order
   */
  scheduleOrder(request: ScheduleDispatchOrderRequest): Observable<DispatchOrder> {
    return this.orderEndpoint.createFromRequest(request);
  }

  /**
   * Assigns a vehicle (POST /dispatch-orders/{id}/vehicle-assignment).
   *
   * @param id        - Order identifier
   * @param vehicleId - Vehicle identifier
   * @returns Observable completing when the vehicle was assigned
   */
  assignVehicle(id: number, vehicleId: number): Observable<void> {
    return this.orderEndpoint.command('POST', `${id}/vehicle-assignment`, { vehicleId });
  }

  /**
   * Validates the scanned pallets (POST /dispatch-orders/{id}/cargo-validation).
   *
   * @param id             - Order identifier
   * @param scannedPallets - Scanned pallet codes
   * @returns Observable completing when the cargo was validated
   */
  validateCargo(id: number, scannedPallets: string[]): Observable<void> {
    return this.orderEndpoint.command('POST', `${id}/cargo-validation`, { scannedPallets });
  }

  /**
   * Changes the priority (PATCH /dispatch-orders/{id}/priority).
   *
   * @param id       - Order identifier
   * @param priority - New priority
   * @returns Observable completing when the priority was changed
   */
  changePriority(id: number, priority: string): Observable<void> {
    return this.orderEndpoint.command('PATCH', `${id}/priority`, { priority });
  }

  /**
   * Registers the departure (POST /dispatch-orders/{id}/departure).
   *
   * @param id - Order identifier
   * @returns Observable completing when the order is in transit
   */
  registerDeparture(id: number): Observable<void> {
    return this.orderEndpoint.command('POST', `${id}/departure`);
  }

  /**
   * Cancels the order (POST /dispatch-orders/{id}/cancellation).
   *
   * @param id - Order identifier
   * @returns Observable completing when the order was cancelled
   */
  cancelOrder(id: number): Observable<void> {
    return this.orderEndpoint.command('POST', `${id}/cancellation`);
  }

  /**
   * Retrieves every cargo assignment.
   *
   * @returns Observable stream emitting CargoAssignment entities
   */
  getCargo(): Observable<CargoAssignment[]> {
    return this.cargoEndpoint.getAll();
  }

}
