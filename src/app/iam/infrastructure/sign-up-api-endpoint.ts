import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, switchMap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { User } from '../domain/model/user.entity';
import { UserAssembler } from './user-assembler';
import { SignUpRequest } from './sign-up.request';
import { UserResource } from './user-response';

const usersApiEndpointUrl = `${environment.serverBasePath}${environment.usersEndpointPath}`;

/**
 * HTTP endpoint client for user registration operations.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer. Before creating the user
 * it verifies that the e-mail is not registered yet and answers with a
 * conflict error otherwise, emulating the behavior of the backend.
 */
export class SignUpApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Creates a new SignUpApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to execute HTTP requests
   * @param assembler - Assembler used to map the created resource into a User entity
   */
  constructor(
    private readonly http: HttpClient,
    private readonly assembler: UserAssembler,
  ) {
    super();
  }

  /**
   * Registers a new user account.
   *
   * @param request - Sign-up request payload
   * @returns Observable stream emitting the created User entity
   */
  signUp(request: SignUpRequest): Observable<User> {
    const params = new HttpParams().set('email', request.email);

    return this.http.get<UserResource[]>(usersApiEndpointUrl, { params }).pipe(
      switchMap((existing) =>
        existing.length > 0
          ? throwError(() => new HttpErrorResponse({ status: 409 }))
          : this.http.post<UserResource>(usersApiEndpointUrl, request),
      ),
      map((resource) => this.assembler.toEntityFromResource(resource)),
      catchError((error: HttpErrorResponse) =>
        error.status === 409
          ? throwError(() => error)
          : this.handleError('Failed to sign up')(error),
      ),
    );
  }
}
