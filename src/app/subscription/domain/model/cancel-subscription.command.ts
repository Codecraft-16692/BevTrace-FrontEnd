/**
 * Command for cancelling a subscription.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface CancelSubscriptionCommand {
  /**
   * The identifier of the subscription.
   */
  subscriptionId: number;
}
