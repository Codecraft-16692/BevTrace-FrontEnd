import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { IamStore } from '../application/iam.store';

/**
 * HTTP interceptor that attaches the current bearer token to outgoing requests.
 *
 * @remarks
 * This interceptor belongs to the IAM infrastructure layer. It only touches requests
 * sent to the BevTrace API: it adds the JWT in the Authorization header using the
 * Bearer scheme and, when the backend answers 401 to an authenticated request
 * (expired or invalid token), it closes the local session and sends the user home.
 */
export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.serverBasePath)) {
    return next(req);
  }

  const iamStore = inject(IamStore);
  const router = inject(Router);
  const token = iamStore.currentToken();

  if (!token) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(authenticatedRequest).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        iamStore.signOut(router);
      }
      return throwError(() => error);
    }),
  );
};
