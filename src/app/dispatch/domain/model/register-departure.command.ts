/**
 * Command for registering the departure of a dispatch.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface RegisterDepartureCommand {
  /**
   * The identifier of the dispatch order.
   */
  dispatchOrderId: number;
}
