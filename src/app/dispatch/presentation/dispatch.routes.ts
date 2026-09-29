import { Routes } from '@angular/router';
import { Layout } from '../../shared/presentation/components/layout/layout';
import { iamGuard } from '../../iam/infrastructure/iam-guard';
import { roleGuard } from '../../iam/infrastructure/role-guard';

/**
 * Lazy loads the dispatch queue view component.
 *
 * @returns A Promise that resolves to the DispatchQueue component
 */
const dispatchQueue = () => import('./views/dispatch-queue/dispatch-queue').then((m) => m.DispatchQueue);

/**
 * Lazy loads the dispatch scheduling form view component.
 *
 * @returns A Promise that resolves to the DispatchForm component
 */
const dispatchForm = () => import('./views/dispatch-form/dispatch-form').then((m) => m.DispatchForm);

/**
 * Lazy loads the dispatch detail view component.
 *
 * @returns A Promise that resolves to the DispatchDetail component
 */
const dispatchDetail = () => import('./views/dispatch-detail/dispatch-detail').then((m) => m.DispatchDetail);

/**
 * Base title used by dispatch routes.
 */
const baseTitle = 'BevTrace';

/**
 * Routing configuration for the Dispatch bounded context.
 *
 * @remarks
 * These routes are lazy loaded inside the main Layout. Scheduling a dispatch is
 * reserved to logistics managers and administrators.
 */
export const dispatchRoutes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard],
    children: [
      { path: 'queue', loadComponent: dispatchQueue, title: `Dispatch Queue | ${baseTitle}` },
      {
        path: 'new',
        loadComponent: dispatchForm,
        canActivate: [roleGuard('ROLE_LOGISTICS_MANAGER')],
        title: `Schedule Dispatch | ${baseTitle}`,
      },
      { path: ':id', loadComponent: dispatchDetail, title: `Dispatch Detail | ${baseTitle}` },
      { path: '', redirectTo: 'queue', pathMatch: 'full' },
    ],
  },
];
