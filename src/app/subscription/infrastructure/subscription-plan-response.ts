import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a subscription plan for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface SubscriptionPlanResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The plan code.
   */
  code: string;

  /**
   * The plan name.
   */
  name: string;

  /**
   * The translation key of the plan description.
   */
  descriptionKey: string;

  /**
   * The price amount for the billing period.
   */
  priceAmount: number;

  /**
   * The ISO currency code.
   */
  currency: string;

  /**
   * The billing period.
   */
  billingPeriod: 'MONTHLY' | 'YEARLY';

  /**
   * The maximum number of active routes.
   */
  maxRoutes: number;

  /**
   * The maximum number of IoT node connections.
   */
  maxDevices: number;

  /**
   * The maximum number of users.
   */
  maxUsers: number;

  /**
   * The translation keys of the included features.
   */
  featureKeys: string[];

  /**
   * Indicates whether the plan is promoted as most popular.
   */
  highlighted: boolean;

  /**
   * Indicates whether the plan requires contacting sales.
   */
  custom: boolean;

  /**
   * Indicates whether the plan can be purchased.
   */
  active: boolean;
}

/**
 * Response envelope for a subscription plan collection queries.
 */
export interface SubscriptionPlansResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  plans: SubscriptionPlanResource[];
}
