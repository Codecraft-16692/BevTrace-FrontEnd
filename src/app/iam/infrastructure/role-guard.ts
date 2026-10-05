import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { IamStore } from '../application/iam.store';

/**
 * Creates a route guard that only allows users holding one of the given roles.
 *
 * @remarks
 * Administrators always pass the guard. Users without the required role are
 * redirected to the dashboard.
 *
 * @param roles - Roles allowed to access the route
 * @returns Guard function to be used in the route configuration
 */
export const roleGuard =
  (...roles: string[]): CanActivateFn =>
  () => {
    const store = inject(IamStore);
    const router = inject(Router);

    if (store.hasAnyRole(roles)) {
      return true;
    }

    router.navigate(['/dashboard']).then();
    return false;
  };
