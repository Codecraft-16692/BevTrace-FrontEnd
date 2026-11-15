/**
 * Command for granting a permission (a role) to a user.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store. Granting a permission also
 * enables the account, so it is how a new sign-up is approved.
 */
export interface GrantPermissionCommand {
  /**
   * The identifier of the user receiving the permission.
   */
  userId: number;

  /**
   * The identifier of the role to grant.
   */
  roleId: number;
}
