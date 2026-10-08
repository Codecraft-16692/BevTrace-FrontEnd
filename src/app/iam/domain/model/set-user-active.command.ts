/**
 * Command for enabling or disabling a user account.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface SetUserActiveCommand {
  /**
   * The identifier of the user.
   */
  userId: number;

  /**
   * The new activation state.
   */
  active: boolean;
}
