import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an authorization role for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface RoleResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The role name, prefixed with ROLE_.
   */
  name: string;

  /**
   * Indicates whether the role grants administrator privileges.
   */
  isAdmin: boolean;
}

/**
 * Response envelope for an authorization role collection queries.
 */
export interface RolesResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  roles: RoleResource[];
}
