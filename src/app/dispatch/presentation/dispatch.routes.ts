import { Routes } from '@angular/router';
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
 * The resource is the plural `orders` (mounted under `/dispatch`): the collection, the creation
 * form (`/new`) and one order (`/:id`). Scheduling a dispatch is reserved to
 * logistics managers.
 */
export const dispatchRoutes: Routes = [
  { path: 'orders', loadComponent: dispatchQueue, title: `Dispatch Orders | ${baseTitle}` },
  {
    path: 'orders/new',
    loadComponent: dispatchForm,
    canActivate: [roleGuard('ROLE_LOGISTICS_MANAGER')],
    title: `Schedule Dispatch | ${baseTitle}`,
  },
  { path: 'orders/:id', loadComponent: dispatchDetail, title: `Dispatch Order | ${baseTitle}` },
  { path: '', redirectTo: 'orders', pathMatch: 'full' },
];
