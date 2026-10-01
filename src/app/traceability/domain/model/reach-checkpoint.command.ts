/**
 * Command for registering that a checkpoint was reached.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface ReachCheckpointCommand {
  /**
   * The identifier of the traceability log.
   */
  logId: number;

  /**
   * The sequence of the reached checkpoint.
   */
  sequence: number;
}
