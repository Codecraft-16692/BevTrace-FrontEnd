/**
 * Command for running the physical inventory reconciliation.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface RunReconciliationCommand {
  /**
   * The identifier of the user running the reconciliation.
   */
  userId: number;

  /**
   * The physical count per batch.
   */
  counts: { batchId: number; countedQty: number }[];
}
