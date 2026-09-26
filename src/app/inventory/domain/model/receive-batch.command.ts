/**
 * Command for registering the entry of a batch by scanning its code.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface ReceiveBatchCommand {
  /**
   * The scanned batch code.
   */
  scanCode: string;

  /**
   * The identifier of the operator registering the entry.
   */
  userId: number;
}
