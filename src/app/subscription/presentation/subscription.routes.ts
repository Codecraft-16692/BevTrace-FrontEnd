import { Routes } from '@angular/router';
import { Layout } from '../../shared/presentation/components/layout/layout';
import { iamGuard } from '../../iam/infrastructure/iam-guard';
import { roleGuard } from '../../iam/infrastructure/role-guard';

/**
 * Lazy loads the plan list view component.
 *
 * @returns A Promise that resolves to the PlanList component
 */
const planList = () => import('./views/plan-list/plan-list').then((m) => m.PlanList);

/**
 * Lazy loads the checkout view component.
 *
 * @returns A Promise that resolves to the Checkout component
 */
const checkout = () => import('./views/checkout/checkout').then((m) => m.Checkout);

/**
 * Lazy loads the billing view component.
 *
 * @returns A Promise that resolves to the Billing component
 */
const billing = () => import('./views/billing/billing').then((m) => m.Billing);

/**
 * Lazy loads the subscription administration view component.
 *
 * @returns A Promise that resolves to the SubscriptionAdmin component
 */
const subscriptionAdmin = () =>
  import('./views/subscription-admin/subscription-admin').then((m) => m.SubscriptionAdmin);

/**
 * Base title used by subscription routes.
 */
const baseTitle = 'BevTrace';

/**
 * Routing configuration for the Subscription bounded context.
 *
 * @remarks
 * These routes are lazy loaded inside the main Layout. The administration
 * overview is reserved to administrators.
 */
export const subscriptionRoutes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard],
    children: [
      { path: 'plans', loadComponent: planList, title: `Plans | ${baseTitle}` },
      { path: 'checkout', loadComponent: checkout, title: `Checkout | ${baseTitle}` },
      { path: 'billing', loadComponent: billing, title: `Billing | ${baseTitle}` },
      {
        path: 'admin',
        loadComponent: subscriptionAdmin,
        canActivate: [roleGuard('ROLE_ADMIN')],
        title: `Subscriptions Admin | ${baseTitle}`,
      },
      { path: '', redirectTo: 'billing', pathMatch: 'full' },
    ],
  },
];
