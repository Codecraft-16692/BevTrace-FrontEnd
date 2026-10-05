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

import { CreateDispatchOrderRequest } from './dispatch-order.request';
import { CreateCargoAssignmentRequest } from './cargo-assignment.request';

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
   * Changes the availability of a vehicle.
   *
   * @param id - Identifier of the vehicle
   * @param isAvailable - New availability
   * @returns Observable stream emitting the updated TransportVehicle
   */
  setVehicleAvailable(id: number, isAvailable: boolean): Observable<TransportVehicle> {
    return this.vehicleEndpoint.patch(id, { isAvailable });
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
   * Creates a dispatch order.
   *
   * @param request - Dispatch order creation payload
   * @returns Observable stream emitting the created DispatchOrder
   */
  createOrder(request: CreateDispatchOrderRequest): Observable<DispatchOrder> {
    return this.orderEndpoint.createFromRequest(request);
  }

  /**
   * Partially updates a dispatch order.
   *
   * @param id - Identifier of the order
   * @param changes - Fields to change
   * @returns Observable stream emitting the updated DispatchOrder
   */
  updateOrder(
    id: number,
    changes: Partial<
      Pick<
        DispatchOrder,
        | 'vehicleId'
        | 'status'
        | 'priority'
        | 'cargoValidated'
        | 'departedAt'
        | 'deliveredAt'
        | 'deliveredQuantity'
      >
    >,
  ): Observable<DispatchOrder> {
    return this.orderEndpoint.patch(id, changes);
  }

  /**
   * Retrieves every cargo assignment.
   *
   * @returns Observable stream emitting CargoAssignment entities
   */
  getCargo(): Observable<CargoAssignment[]> {
    return this.cargoEndpoint.getAll();
  }

  /**
   * Creates a cargo assignment.
   *
   * @param request - Cargo assignment creation payload
   * @returns Observable stream emitting the created CargoAssignment
   */
  createCargo(request: CreateCargoAssignmentRequest): Observable<CargoAssignment> {
    return this.cargoEndpoint.createFromRequest(request);
  }
}
