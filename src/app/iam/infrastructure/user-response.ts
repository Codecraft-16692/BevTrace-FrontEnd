import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a platform user for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface UserResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the role assigned to the user.
   */
  roleId: number;

  /**
   * The full name of the user.
   */
  name: string;

  /**
   * The e-mail address used to sign in.
   */
  email: string;

  /**
   * The contact phone number.
   */
  phone: string;

  /**
   * Indicates whether the account is enabled.
   */
  active: boolean;

  /**
   * The ISO 8601 timestamp of account creation.
   */
  createdAt: string;

  /**
   * Embedded role returned by the `_expand` query.
   */
  role?: { name: string };

  /**
   * Mock credential stored by json-server. Never used in production.
   */
  password?: string;
}

/**
 * Response envelope for a platform user collection queries.
 */
export interface UsersResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  users: UserResource[];
}
