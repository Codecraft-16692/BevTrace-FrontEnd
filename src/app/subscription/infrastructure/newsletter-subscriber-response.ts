import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a newsletter subscriber for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface NewsletterSubscriberResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The subscribed e-mail address.
   */
  email: string;

  /**
   * The ISO 8601 timestamp of the subscription.
   */
  subscribedAt: string;
}

/**
 * Response envelope for a newsletter subscriber collection queries.
 */
export interface NewsletterSubscribersResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  subscribers: NewsletterSubscriberResource[];
}
