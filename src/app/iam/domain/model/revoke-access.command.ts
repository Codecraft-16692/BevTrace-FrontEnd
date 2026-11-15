/**
 * Command for revoking the access of a user.
 *
 * @remarks
 * The account is disabled and cannot sign in until a permission is granted again.
 */
export interface RevokeAccessCommand {
  /**
   * The identifier of the user losing the access.
   */
  userId: number;
}
