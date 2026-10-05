/**
 * Command for registering a new user account.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface SignUpCommand {
  /**
   * The full name of the user.
   */
  name: string;

  /**
   * The e-mail address of the new account.
   */
  email: string;

  /**
   * The contact phone number.
   */
  phone: string;

  /**
   * The password of the new account.
   */
  password: string;

  /**
   * The identifier of the role assigned to the new user.
   */
  roleId: number;
}
