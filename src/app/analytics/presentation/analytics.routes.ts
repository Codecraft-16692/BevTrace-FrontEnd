import { Routes } from '@angular/router';
import { Layout } from '../../shared/presentation/components/layout/layout';
import { iamGuard } from '../../iam/infrastructure/iam-guard';
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
 * These routes are lazy loaded inside the main Layout and reserved to
 * logistics managers and administrators.
 */
export const analyticsRoutes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard, roleGuard('ROLE_LOGISTICS_MANAGER')],
    children: [
      { path: 'dashboard', loadComponent: kpiDashboard, title: `Performance | ${baseTitle}` },
      { path: 'reports', loadComponent: reportGenerator, title: `Reports | ${baseTitle}` },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
