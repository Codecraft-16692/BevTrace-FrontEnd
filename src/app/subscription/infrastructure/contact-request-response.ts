import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a commercial contact request for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface ContactRequestResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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
   * The message sent.
   */
  message: string;

  /**
   * The ISO 8601 timestamp of the request.
   */
  createdAt: string;
}

/**
 * Response envelope for a commercial contact request collection queries.
 */
export interface ContactRequestsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  requests: ContactRequestResource[];
}
