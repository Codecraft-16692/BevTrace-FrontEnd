/**
 * Command for changing the operational priority of a dispatch.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface ChangeDispatchPriorityCommand {
  /**
   * The identifier of the dispatch order.
   */
  dispatchOrderId: number;

  /**
   * The new operational priority.
   */
  priority: 'STANDARD' | 'LOGISTICS' | 'URGENT';
}
