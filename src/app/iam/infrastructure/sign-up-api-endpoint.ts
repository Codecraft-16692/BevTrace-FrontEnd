import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from '../../shared/infrastructure/error-handling-enabled-base-type';
import { SignUpRequest } from './sign-up.request';

const signUpUrl = `${environment.serverBasePath}/authentication/sign-up`;

/**
 * Account created by the backend after a successful sign-up.
 */
export interface SignUpResource {
  id: number;
  name: string;
  email: string;
}

/**
 * HTTP endpoint client for user registration operations.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer. The backend validates the
 * payload, rejects duplicated e-mails and administrator self-registration, and
 * stores the password hashed.
 */
export class SignUpApiEndpoint extends ErrorHandlingEnabledBaseType {
  /**
   * Creates a new SignUpApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to execute HTTP requests
   */
  constructor(private readonly http: HttpClient) {
    super();
  }

  /**
   * Registers a new user account.
   *
   * @param request - Sign-up request payload
   * @returns Observable stream emitting the created account
   */
  signUp(request: SignUpRequest): Observable<SignUpResource> {
    return this.http
      .post<SignUpResource>(signUpUrl, request)
      .pipe(catchError(this.handleError('Failed to sign up')));
  }
}
