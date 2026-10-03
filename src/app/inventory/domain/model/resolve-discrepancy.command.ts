/**
 * Command for resolving an inventory discrepancy.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface ResolveDiscrepancyCommand {
  /**
   * The identifier of the discrepancy.
   */
  discrepancyId: number;

  /**
   * The resolution note.
   */
  note: string;
}
