import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { iamGuard } from './iam/infrastructure/iam-guard';
import { authRoutes, userRoutes } from './iam/presentation/iam.routes';
import { inventoryRoutes } from './inventory/presentation/inventory.routes';
import { dispatchRoutes } from './dispatch/presentation/dispatch.routes';
import { traceabilityRoutes } from './traceability/presentation/traceability.routes';
import { telemetryRoutes } from './telemetry/presentation/telemetry.routes';
import { incidentRoutes } from './incident/presentation/incident.routes';
import { analyticsRoutes } from './analytics/presentation/analytics.routes';
import { subscriptionRoutes } from './subscription/presentation/subscription.routes';

/**
 * Lazy loads the landing page view component.
 *
 * @returns A Promise that resolves to the Home component
 */
const home = () => import('./shared/presentation/views/home/home').then((m) => m.Home);

/**
 * Lazy loads the operations dashboard view component.
 *
 * @returns A Promise that resolves to the Dashboard component
 */
const dashboard = () =>
  import('./shared/presentation/views/dashboard/dashboard').then((m) => m.Dashboard);

/**
 * Lazy loads the not found view component.
 *
 * @returns A Promise that resolves to the PageNotFound component
 */
const pageNotFound = () =>
  import('./shared/presentation/views/page-not-found/page-not-found').then((m) => m.PageNotFound);

/**
 * Base title used by the application routes.
 */
const baseTitle = 'BevTrace';

/**
 * Root routing configuration of BevTrace.
 *
 * @remarks
 * Every bounded context keeps its own prefix (`/inventory`, `/dispatch`, `/iam`...)
 * and its paths name plural resources (`/inventory/products`, `/dispatch/orders`,
 * `/telemetry/devices`...). The landing page and the authentication screens
 * are public; every other route is rendered inside the main Layout, which
 * requires an authenticated session. Each bounded context exports its own
 * routes and its views are lazy loaded one by one.
 */
export const routes: Routes = [
  { path: 'home', loadComponent: home, title: `${baseTitle} | IoT Beverage Logistics` },
  ...authRoutes,
  // Must come before the Layout route: both have an empty path and the Layout requires a session.
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard],
    children: [
      { path: 'dashboard', loadComponent: dashboard, title: `Dashboard | ${baseTitle}` },
      { path: 'inventory', children: inventoryRoutes },
      { path: 'dispatch', children: dispatchRoutes },
      { path: 'traceability', children: traceabilityRoutes },
      { path: 'telemetry', children: telemetryRoutes },
      { path: 'incident', children: incidentRoutes },
      { path: 'analytics', children: analyticsRoutes },
      { path: 'subscription', children: subscriptionRoutes },
      ...userRoutes,
    ],
  },
  { path: '**', loadComponent: pageNotFound, title: `Not Found | ${baseTitle}` },
];
