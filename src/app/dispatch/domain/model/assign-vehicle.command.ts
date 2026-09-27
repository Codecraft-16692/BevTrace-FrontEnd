/**
 * Command for assigning a vehicle to a dispatch.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface AssignVehicleCommand {
  /**
   * The identifier of the dispatch order.
   */
  dispatchOrderId: number;

  /**
   * The identifier of the vehicle.
   */
  vehicleId: number;
}
