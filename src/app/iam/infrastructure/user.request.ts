/**
 * Request payload for creating a platform user.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateUserRequest {
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
}
