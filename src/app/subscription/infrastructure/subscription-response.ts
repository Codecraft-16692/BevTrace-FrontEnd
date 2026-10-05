import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a company subscription for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface SubscriptionResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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

  /**
   * Embedded user returned by the `_expand` query.
   */
  user?: { name: string; email: string };
}

/**
 * Response envelope for a company subscription collection queries.
 */
export interface SubscriptionsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  subscriptions: SubscriptionResource[];
}
