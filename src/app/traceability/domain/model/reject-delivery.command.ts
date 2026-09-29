/**
 * Command for registering a delivery rejected by the client.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface RejectDeliveryCommand {
  /**
   * The identifier of the traceability log.
   */
  logId: number;

  /**
   * The rejection reason.
   */
  reason: string;
}
