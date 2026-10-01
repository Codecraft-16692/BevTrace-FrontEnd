/**
 * Command for confirming the delivery of a batch at destination.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface FinalizeDeliveryCommand {
  /**
   * The identifier of the traceability log.
   */
  logId: number;

  /**
   * The person who received the delivery.
   */
  receivedBy: string;
}
