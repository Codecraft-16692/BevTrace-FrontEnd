/**
 * Command for registering a product waste.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface RegisterWasteCommand {
  /**
   * The identifier of the affected batch.
   */
  batchId: number;

  /**
   * The identifier of the reporting user.
   */
  userId: number;

  /**
   * The number of units lost.
   */
  quantity: number;

  /**
   * The reason of the waste.
   */
  reason: string;
}
