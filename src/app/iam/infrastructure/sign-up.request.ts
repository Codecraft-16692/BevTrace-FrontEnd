import { CreateUserRequest } from './user.request';

/**
 * Request payload for registering a new user account.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and extends the user
 * creation payload with the mock credential stored by json-server.
 *
 * @example
 * ```typescript
 * const request: SignUpRequest = {
 *   roleId: 2,
 *   name: 'Alex Rivera',
 *   email: 'alex@bevtrace.com',
 *   phone: '+51 987 654 321',
 *   active: true,
 *   createdAt: new Date().toISOString(),
 *   password: 'Secure1234'
 * };
 * ```
 */
export interface SignUpRequest extends CreateUserRequest {
  /**
   * The password of the new account.
   */
  password: string;
}
