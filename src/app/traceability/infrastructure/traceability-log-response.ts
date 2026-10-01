import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a route traceability log for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface TraceabilityLogResource extends BaseResource {
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
}

/**
 * Response envelope for a route traceability log collection queries.
 */
export interface TraceabilityLogsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  logs: TraceabilityLogResource[];
}
