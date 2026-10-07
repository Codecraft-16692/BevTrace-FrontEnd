import { UserResource } from './user-response';
import { SignInResource } from './sign-in-response';

/**
 * Assembler for converting user resources into sign-in session resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer. It converts the user
 * resource returned by the mock API into the SignInResource used by the IAM
 * API facade and generates the mock session token.
 */
export class SignInAssembler {
  /**
   * Converts a user resource into a sign-in session resource.
   *
   * @param resource - User resource returned by the mock API
   * @returns Infrastructure resource containing authenticated session data
   */
  toResourceFromUser(resource: UserResource): SignInResource {
    return {
      id: resource.id,
      name: resource.name,
      email: resource.email,
      roles: resource.role ? [resource.role.name] : [],
      token: btoa(`${resource.id}:${resource.email}:${Date.now()}`),
    };
  }
}
