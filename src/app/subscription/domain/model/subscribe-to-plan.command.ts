/**
 * Command for paying and activating a subscription.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface SubscribeToPlanCommand {
  /**
   * The identifier of the subscribing user.
   */
  userId: number;

  /**
   * The name of the subscribing company.
   */
  companyName: string;

  /**
   * The code of the plan.
   */
  planCode: string;

  /**
   * The billing cycle.
   */
  billingCycle: 'MONTHLY' | 'YEARLY';

  /**
   * The name printed on the card.
   */
  cardHolder: string;

  /**
   * The card number. Only the last four digits are persisted by the mock.
   */
  cardNumber: string;
}
