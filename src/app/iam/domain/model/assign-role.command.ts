/**
 * Command for assigning an authorization role to a user.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface AssignRoleCommand {
  /**
   * The identifier of the user receiving the role.
   */
  userId: number;

  /**
   * The identifier of the role to assign.
   */
  roleId: number;
}
