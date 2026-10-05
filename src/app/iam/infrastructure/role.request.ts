/**
 * Request payload for creating an authorization role.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateRoleRequest {
  /**
   * The role name, prefixed with ROLE_.
   */
  name: string;

  /**
   * Indicates whether the role grants administrator privileges.
   */
  isAdmin: boolean;
}
