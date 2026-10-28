import { Routes } from '@angular/router';
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
 * Resources: `plans` (catalog), `subscriptions` (the billing of the
 * account), `subscriptions/new` (checkout of a plan) and `admin/subscriptions`
 * (administrator overview).
 */
export const subscriptionRoutes: Routes = [
  { path: 'plans', loadComponent: planList, title: `Subscription Plans | ${baseTitle}` },
  { path: 'subscriptions', loadComponent: billing, title: `Subscriptions | ${baseTitle}` },
  { path: 'subscriptions/new', loadComponent: checkout, title: `New Subscription | ${baseTitle}` },
  {
    path: 'admin/subscriptions',
    loadComponent: subscriptionAdmin,
    canActivate: [roleGuard('ROLE_ADMIN')],
    title: `Subscriptions Admin | ${baseTitle}`,
  },
  { path: '', redirectTo: 'subscriptions', pathMatch: 'full' },
];
