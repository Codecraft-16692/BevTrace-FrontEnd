/**
 * Command for confirming a reconciliation.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface ConfirmReconciliationCommand {
  /**
   * The identifier of the reconciliation.
   */
  reconciliationId: number;

  /**
   * The identifier of the confirming user.
   */
  userId: number;
}
