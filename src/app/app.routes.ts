import { Routes } from '@angular/router';
import { Layout } from './shared/presentation/components/layout/layout';
import { iamGuard } from './iam/infrastructure/iam-guard';

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
 * Lazy loads the IAM routes.
 *
 * @returns A Promise that resolves to the IAM routes
 */
const iamRoutes = () => import('./iam/presentation/iam.routes').then((m) => m.iamRoutes);

/**
 * Lazy loads the inventory routes.
 *
 * @returns A Promise that resolves to the inventory routes
 */
const inventoryRoutes = () =>
  import('./inventory/presentation/inventory.routes').then((m) => m.inventoryRoutes);

/**
 * Lazy loads the dispatch routes.
 *
 * @returns A Promise that resolves to the dispatch routes
 */
const dispatchRoutes = () =>
  import('./dispatch/presentation/dispatch.routes').then((m) => m.dispatchRoutes);

/**
 * Lazy loads the traceability routes.
 *
 * @returns A Promise that resolves to the traceability routes
 */
const traceabilityRoutes = () =>
  import('./traceability/presentation/traceability.routes').then((m) => m.traceabilityRoutes);

/**
 * Lazy loads the telemetry routes.
 *
 * @returns A Promise that resolves to the telemetry routes
 */
const telemetryRoutes = () =>
  import('./telemetry/presentation/telemetry.routes').then((m) => m.telemetryRoutes);

/**
 * Lazy loads the incident routes.
 *
 * @returns A Promise that resolves to the incident routes
 */
const incidentRoutes = () =>
  import('./incident/presentation/incident.routes').then((m) => m.incidentRoutes);

/**
 * Lazy loads the analytics routes.
 *
 * @returns A Promise that resolves to the analytics routes
 */
const analyticsRoutes = () =>
  import('./analytics/presentation/analytics.routes').then((m) => m.analyticsRoutes);

/**
 * Lazy loads the subscription routes.
 *
 * @returns A Promise that resolves to the subscription routes
 */
const subscriptionRoutes = () =>
  import('./subscription/presentation/subscription.routes').then((m) => m.subscriptionRoutes);

/**
 * Base title used by the application routes.
 */
const baseTitle = 'BevTrace';

/**
 * Root routing configuration of BevTrace.
 *
 * @remarks
 * Every bounded context exposes its own routes and is lazy loaded under its
 * own prefix. The landing page is public; the dashboard and the operational
 * contexts require an authenticated session and are rendered inside the main
 * Layout.
 */
export const routes: Routes = [
  { path: 'home', loadComponent: home, title: `${baseTitle} | IoT Beverage Logistics` },
  { path: 'iam', loadChildren: iamRoutes },
  {
    path: 'dashboard',
    component: Layout,
    canActivate: [iamGuard],
    children: [{ path: '', loadComponent: dashboard, title: `Dashboard | ${baseTitle}` }],
  },
  { path: 'inventory', loadChildren: inventoryRoutes },
  { path: 'dispatch', loadChildren: dispatchRoutes },
  { path: 'traceability', loadChildren: traceabilityRoutes },
  { path: 'telemetry', loadChildren: telemetryRoutes },
  { path: 'incidents', loadChildren: incidentRoutes },
  { path: 'analytics', loadChildren: analyticsRoutes },
  { path: 'subscriptions', loadChildren: subscriptionRoutes },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', loadComponent: pageNotFound, title: `Not Found | ${baseTitle}` },
];
