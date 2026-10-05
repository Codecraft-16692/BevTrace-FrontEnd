import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { SignInAssembler } from './sign-in-assembler';
import { SignInRequest } from './sign-in.request';
import { SignInResource } from './sign-in-response';
import { UserResource } from './user-response';

const usersApiEndpointUrl = `${environment.serverBasePath}${environment.usersEndpointPath}`;

/**
 * HTTP endpoint client for user sign-in operations.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and emulates the backend
 * authentication by looking up the user by e-mail and comparing the password.
 * It must be replaced by a POST to the authentication service when the real
 * backend is available.
 */
export class SignInApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Creates a new SignInApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to execute HTTP requests
   * @param assembler - Assembler used to map users into session resources
   */
  constructor(
    private readonly http: HttpClient,
    private readonly assembler: SignInAssembler,
  ) {
    super();
  }

  /**
   * Authenticates an existing user.
   *
   * @param request - Sign-in request payload containing e-mail and password
   * @returns Observable stream emitting the authenticated session resource
   */
  signIn(request: SignInRequest): Observable<SignInResource> {
    const params = new HttpParams().set('email', request.email).set('_expand', 'role');

    return this.http.get<UserResource[]>(usersApiEndpointUrl, { params }).pipe(
      map((users) => {
        const user = users[0];
        if (!user || user.password !== request.password) {
          throw new HttpErrorResponse({ status: 401 });
        }
        if (!user.active) {
          throw new HttpErrorResponse({ status: 403 });
        }
        return this.assembler.toResourceFromUser(user);
      }),
      catchError((error: HttpErrorResponse) =>
        error.status === 401 || error.status === 403
          ? throwError(() => error)
          : this.handleError('Failed to sign in')(error),
      ),
    );
  }
}
