import { Routes } from '@angular/router';

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
 * Resources: `incidents`, `alert-rules` and `notifications`.
 */
export const incidentRoutes: Routes = [
  { path: 'incidents', loadComponent: incidentDashboard, title: `Incidents | ${baseTitle}` },
  { path: 'alert-rules', loadComponent: alertRules, title: `Alert Rules | ${baseTitle}` },
  { path: 'notifications', loadComponent: notificationCenter, title: `Notifications | ${baseTitle}` },
  { path: '', redirectTo: 'incidents', pathMatch: 'full' },
];
