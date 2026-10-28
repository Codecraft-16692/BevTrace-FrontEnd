import { Routes } from '@angular/router';
import { roleGuard } from '../../iam/infrastructure/role-guard';

/**
 * Lazy loads the performance dashboard view component.
 *
 * @returns A Promise that resolves to the KpiDashboard component
 */
const kpiDashboard = () => import('./views/kpi-dashboard/kpi-dashboard').then((m) => m.KpiDashboard);

/**
 * Lazy loads the report generator view component.
 *
 * @returns A Promise that resolves to the ReportGenerator component
 */
const reportGenerator = () =>
  import('./views/report-generator/report-generator').then((m) => m.ReportGenerator);

/**
 * Base title used by analytics routes.
 */
const baseTitle = 'BevTrace';

/**
 * Routing configuration for the Analytics bounded context.
 *
 * @remarks
 * Resources: `kpis` (performance indicators) and `reports`. Both are
 * reserved to logistics managers and administrators.
 */
export const analyticsRoutes: Routes = [
  {
    path: 'kpis',
    loadComponent: kpiDashboard,
    canActivate: [roleGuard('ROLE_LOGISTICS_MANAGER')],
    title: `KPIs | ${baseTitle}`,
  },
  {
    path: 'reports',
    loadComponent: reportGenerator,
    canActivate: [roleGuard('ROLE_LOGISTICS_MANAGER')],
    title: `Logistics Reports | ${baseTitle}`,
  },
  { path: '', redirectTo: 'kpis', pathMatch: 'full' },
];
