import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { SignInRequest } from './sign-in.request';
import { SignInResource } from './sign-in-response';

const signInUrl = `${environment.serverBasePath}/authentication/sign-in`;

/**
 * HTTP endpoint client for user sign-in operations.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer. It posts the credentials to the
 * authentication service of the backend, which answers with the user, its roles and
 * the signed JWT. Credential and disabled-account errors reach the store as a
 * BusinessError carrying the i18n key sent by the backend.
 */
export class SignInApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Creates a new SignInApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to execute HTTP requests
   */
  constructor(private readonly http: HttpClient) {
    super();
  }

  /**
   * Authenticates an existing user.
   *
   * @param request - Sign-in request payload containing e-mail and password
   * @returns Observable stream emitting the authenticated session resource
   */
  signIn(request: SignInRequest): Observable<SignInResource> {
    return this.http
      .post<SignInResource>(signInUrl, request)
      .pipe(catchError(this.handleError('Failed to sign in')));
  }
}
