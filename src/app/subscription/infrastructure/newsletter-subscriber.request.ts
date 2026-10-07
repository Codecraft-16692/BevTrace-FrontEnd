/**
 * Request payload for creating a newsletter subscriber.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateNewsletterSubscriberRequest {
  /**
   * The subscribed e-mail address.
   */
  email: string;

  /**
   * The ISO 8601 timestamp of the subscription.
   */
  subscribedAt: string;
}
