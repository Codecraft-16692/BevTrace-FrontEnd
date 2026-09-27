import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a dispatch order within the dispatch domain.
 *
 * @remarks
 * In Domain-Driven Design, DispatchOrder is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the dispatch bounded context.
 */
export class DispatchOrder implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the responsible logistics manager.
   */
  managerId: number;

  /**
   * The identifier of the assigned vehicle.
   */
  vehicleId: number | null;

  /**
   * The identifier of the delivery destination.
   */
  destinationId: number;

  /**
   * The scheduled departure date in ISO date format.
   */
  scheduledDate: string;

  /**
   * The lifecycle status of the dispatch.
   */
  status: 'SCHEDULED' | 'AUTHORIZED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

  /**
   * The operational priority classification.
   */
  priority: 'STANDARD' | 'LOGISTICS' | 'URGENT';

  /**
   * The estimated cargo weight in kilograms.
   */
  estimatedWeight: number;

  /**
   * The number of units requested by the client.
   */
  requestedQuantity: number;

  /**
   * The number of units finally delivered.
   */
  deliveredQuantity: number | null;

  /**
   * The ISO 8601 timestamp of the delivery.
   */
  deliveredAt: string | null;

  /**
   * The ISO 8601 timestamp of the departure.
   */
  departedAt: string | null;

  /**
   * Indicates whether the loaded pallets were validated against the order.
   */
  cargoValidated: boolean;

  /**
   * The ISO 8601 timestamp of creation.
   */
  createdAt: string;

  /**
   * The name of the destination client.
   */
  destinationName: string;

  /**
   * The commercial region of the destination.
   */
  destinationRegion: string;

  /**
   * The latitude of the destination.
   */
  destinationLatitude: number;

  /**
   * The longitude of the destination.
   */
  destinationLongitude: number;

  /**
   * The plate of the assigned vehicle, empty when not assigned.
   */
  vehiclePlate: string;

  /**
   * Creates a new DispatchOrder entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    managerId: number;
    vehicleId: number | null;
    destinationId: number;
    scheduledDate: string;
    status: 'SCHEDULED' | 'AUTHORIZED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';
    priority: 'STANDARD' | 'LOGISTICS' | 'URGENT';
    estimatedWeight: number;
    requestedQuantity: number;
    deliveredQuantity: number | null;
    deliveredAt: string | null;
    departedAt: string | null;
    cargoValidated: boolean;
    createdAt: string;
    destinationName: string;
    destinationRegion: string;
    destinationLatitude: number;
    destinationLongitude: number;
    vehiclePlate: string;
  }) {
    this.id = params.id;
    this.managerId = params.managerId;
    this.vehicleId = params.vehicleId;
    this.destinationId = params.destinationId;
    this.scheduledDate = params.scheduledDate;
    this.status = params.status;
    this.priority = params.priority;
    this.estimatedWeight = params.estimatedWeight;
    this.requestedQuantity = params.requestedQuantity;
    this.deliveredQuantity = params.deliveredQuantity;
    this.deliveredAt = params.deliveredAt;
    this.departedAt = params.departedAt;
    this.cargoValidated = params.cargoValidated;
    this.createdAt = params.createdAt;
    this.destinationName = params.destinationName;
    this.destinationRegion = params.destinationRegion;
    this.destinationLatitude = params.destinationLatitude;
    this.destinationLongitude = params.destinationLongitude;
    this.vehiclePlate = params.vehiclePlate;
  }
}
