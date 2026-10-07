import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IamStore } from '../application/iam.store';

/**
 * HTTP interceptor that attaches the current bearer token to outgoing requests.
 *
 * @remarks
 * This interceptor belongs to the IAM infrastructure layer. It obtains the
 * current token from IamStore and, when available, adds it to the Authorization
 * header using the Bearer scheme. The mock API ignores the header but the
 * interceptor is kept so the frontend is ready for the real backend.
 */
export const authenticationInterceptor: HttpInterceptorFn = (req, next) => {
  const iamStore = inject(IamStore);
  const token = iamStore.currentToken();

  if (!token) {
    return next(req);
  }

  const authenticatedRequest = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });

  return next(authenticatedRequest);
};
