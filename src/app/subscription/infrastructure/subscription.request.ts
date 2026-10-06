/**
 * Request payload for creating a company subscription.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateSubscriptionRequest {
  /**
   * The identifier of the subscribing user.
   */
  userId: number;

  /**
   * The name of the subscribing company.
   */
  companyName: string;

  /**
   * The code of the subscribed plan.
   */
  planCode: string;

  /**
   * The billing cycle.
   */
  billingCycle: 'MONTHLY' | 'YEARLY';

  /**
   * The subscription status.
   */
  status: 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';

  /**
   * The ISO 8601 start of the current period.
   */
  currentPeriodStart: string;

  /**
   * The ISO 8601 end of the current period.
   */
  currentPeriodEnd: string;

  /**
   * The ISO 8601 cancellation timestamp.
   */
  cancelledAt: string | null;
}
