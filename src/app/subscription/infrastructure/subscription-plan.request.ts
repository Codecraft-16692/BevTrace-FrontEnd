/**
 * Request payload for creating a subscription plan.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateSubscriptionPlanRequest {
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
