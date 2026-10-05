/**
 * Command for starting the traceability of a departed dispatch.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface StartRouteTraceabilityCommand {
  /**
   * The identifier of the departed dispatch order.
   */
  dispatchOrderId: number;

  /**
   * The priority of the dispatch.
   */
  priority: 'STANDARD' | 'LOGISTICS' | 'URGENT';

  /**
   * The destination client name.
   */
  destinationName: string;

  /**
   * The destination latitude.
   */
  destinationLatitude: number;

  /**
   * The destination longitude.
   */
  destinationLongitude: number;

  /**
   * The plate of the vehicle in transit.
   */
  vehiclePlate: string;

  /**
   * The identifier of the vehicle in transit.
   */
  vehicleId: number;

  /**
   * The ISO 8601 departure timestamp.
   */
  departedAt: string;
}
