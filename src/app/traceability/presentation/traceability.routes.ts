import { Routes } from '@angular/router';
import { Layout } from '../../shared/presentation/components/layout/layout';
import { iamGuard } from '../../iam/infrastructure/iam-guard';

/**
 * Lazy loads the active route map view component.
 *
 * @returns A Promise that resolves to the RouteMap component
 */
const routeMap = () => import('./views/route-map/route-map').then((m) => m.RouteMap);

/**
 * Lazy loads the traceability detail view component.
 *
 * @returns A Promise that resolves to the TraceabilityDetail component
 */
const traceabilityDetail = () =>
  import('./views/traceability-detail/traceability-detail').then((m) => m.TraceabilityDetail);

/**
 * Lazy loads the delivery history view component.
 *
 * @returns A Promise that resolves to the DeliveryHistory component
 */
const deliveryHistory = () =>
  import('./views/delivery-history/delivery-history').then((m) => m.DeliveryHistory);

/**
 * Base title used by traceability routes.
 */
const baseTitle = 'BevTrace';

/**
 * Routing configuration for the Traceability bounded context.
 *
 * @remarks
 * These routes are lazy loaded inside the main Layout and protected by the
 * authentication guard.
 */
export const traceabilityRoutes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard],
    children: [
      { path: 'route-map', loadComponent: routeMap, title: `Route Map | ${baseTitle}` },
      { path: 'history', loadComponent: deliveryHistory, title: `Delivery History | ${baseTitle}` },
      { path: 'log/:id', loadComponent: traceabilityDetail, title: `Traceability | ${baseTitle}` },
      { path: '', redirectTo: 'route-map', pathMatch: 'full' },
    ],
  },
];
