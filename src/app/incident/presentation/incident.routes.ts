import { Routes } from '@angular/router';
import { Layout } from '../../shared/presentation/components/layout/layout';
import { iamGuard } from '../../iam/infrastructure/iam-guard';

/**
 * Lazy loads the incident dashboard view component.
 *
 * @returns A Promise that resolves to the IncidentDashboard component
 */
const incidentDashboard = () =>
  import('./views/incident-dashboard/incident-dashboard').then((m) => m.IncidentDashboard);

/**
 * Lazy loads the alert rules view component.
 *
 * @returns A Promise that resolves to the AlertRules component
 */
const alertRules = () => import('./views/alert-rules/alert-rules').then((m) => m.AlertRules);

/**
 * Lazy loads the notification center view component.
 *
 * @returns A Promise that resolves to the NotificationCenter component
 */
const notificationCenter = () =>
  import('./views/notification-center/notification-center').then((m) => m.NotificationCenter);

/**
 * Base title used by incident routes.
 */
const baseTitle = 'BevTrace';

/**
 * Routing configuration for the Incident bounded context.
 *
 * @remarks
 * These routes are lazy loaded inside the main Layout and protected by the
 * authentication guard.
 */
export const incidentRoutes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard],
    children: [
      { path: 'dashboard', loadComponent: incidentDashboard, title: `Incidents | ${baseTitle}` },
      { path: 'rules', loadComponent: alertRules, title: `Alert Rules | ${baseTitle}` },
      { path: 'notifications', loadComponent: notificationCenter, title: `Notifications | ${baseTitle}` },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
