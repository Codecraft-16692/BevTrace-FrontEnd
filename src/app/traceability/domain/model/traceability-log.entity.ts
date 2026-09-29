import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a route traceability log within the traceability domain.
 *
 * @remarks
 * In Domain-Driven Design, TraceabilityLog is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the traceability bounded context.
 */
export class TraceabilityLog implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the traced dispatch order.
   */
  dispatchOrderId: number;

  /**
   * The current traceability status.
   */
  currentStatus: 'IN_TRANSIT' | 'DELIVERY_REJECTED' | 'COMPLETED';

  /**
   * The ISO 8601 timestamp when the route started.
   */
  startTime: string;

  /**
   * The ISO 8601 timestamp when the route ended.
   */
  endTime: string | null;

  /**
   * The ISO 8601 estimated time of arrival.
   */
  estimatedArrival: string;

  /**
   * The latest known latitude.
   */
  currentLatitude: number;

  /**
   * The latest known longitude.
   */
  currentLongitude: number;

  /**
   * The reason registered when the delivery was rejected.
   */
  rejectionReason: string | null;

  /**
   * The priority of the traced dispatch.
   */
  orderPriority: 'STANDARD' | 'LOGISTICS' | 'URGENT';

  /**
   * The name of the destination client.
   */
  destinationName: string;

  /**
   * The plate of the vehicle in transit.
   */
  vehiclePlate: string;

  /**
   * The identifier of the IoT device installed in the vehicle.
   */
  deviceId: number | null;

  /**
   * Creates a new TraceabilityLog entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    dispatchOrderId: number;
    currentStatus: 'IN_TRANSIT' | 'DELIVERY_REJECTED' | 'COMPLETED';
    startTime: string;
    endTime: string | null;
    estimatedArrival: string;
    currentLatitude: number;
    currentLongitude: number;
    rejectionReason: string | null;
    orderPriority: 'STANDARD' | 'LOGISTICS' | 'URGENT';
    destinationName: string;
    vehiclePlate: string;
    deviceId: number | null;
  }) {
    this.id = params.id;
    this.dispatchOrderId = params.dispatchOrderId;
    this.currentStatus = params.currentStatus;
    this.startTime = params.startTime;
    this.endTime = params.endTime;
    this.estimatedArrival = params.estimatedArrival;
    this.currentLatitude = params.currentLatitude;
    this.currentLongitude = params.currentLongitude;
    this.rejectionReason = params.rejectionReason;
    this.orderPriority = params.orderPriority;
    this.destinationName = params.destinationName;
    this.vehiclePlate = params.vehiclePlate;
    this.deviceId = params.deviceId;
  }
}
