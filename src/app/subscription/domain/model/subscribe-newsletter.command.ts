/**
 * Command for subscribing to the commercial newsletter.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface SubscribeNewsletterCommand {
  /**
   * The e-mail address to subscribe.
   */
  email: string;
}
