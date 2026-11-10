/**
 * Request payload of the sign-up (POST /authentication/sign-up).
 *
 * @remarks
 * The backend sets the activation state and the creation date itself.
 */
export interface SignUpRequest {
  roleId: number;

  name: string;

  email: string;

  phone: string;

  password: string;
}
