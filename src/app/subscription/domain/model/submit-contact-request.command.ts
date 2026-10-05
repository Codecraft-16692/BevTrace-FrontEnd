/**
 * Command for sending a commercial contact request.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface SubmitContactRequestCommand {
  /**
   * The full name of the visitor.
   */
  fullName: string;

  /**
   * The contact e-mail.
   */
  email: string;

  /**
   * The company of the visitor.
   */
  company: string;

  /**
   * The message.
   */
  message: string;
}
