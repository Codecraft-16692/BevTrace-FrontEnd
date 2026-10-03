/**
 * Command for signing in an existing user.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface SignInCommand {
  /**
   * The e-mail address of the account.
   */
  email: string;

  /**
   * The password of the account.
   */
  password: string;
}
