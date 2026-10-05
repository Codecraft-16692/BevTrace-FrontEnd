/**
 * Request payload for creating a route traceability log.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateTraceabilityLogRequest {
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
