/**
 * Request payload for user authentication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the data
 * used to authenticate against the mock users collection. It is created from a
 * SignInCommand before performing the API call.
 *
 * @example
 * ```typescript
 * const request: SignInRequest = {
 *   email: 'bevtrace@admin.com',
 *   password: 'Admin1234'
 * };
 * ```
 */
export interface SignInRequest {
  /**
   * The e-mail address of the account.
   */
  email: string;

  /**
   * The password associated with the account.
   */
  password: string;
}
