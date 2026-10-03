import { Routes } from '@angular/router';
import { Layout } from '../../shared/presentation/components/layout/layout';
import { iamGuard } from '../infrastructure/iam-guard';
import { roleGuard } from '../infrastructure/role-guard';

/**
 * Lazy loads the sign-in form view component.
 *
 * @returns A Promise that resolves to the SignInForm component
 */
const signInForm = () => import('./views/sign-in-form/sign-in-form').then((m) => m.SignInForm);

/**
 * Lazy loads the sign-up form view component.
 *
 * @returns A Promise that resolves to the SignUpForm component
 */
const signUpForm = () => import('./views/sign-up-form/sign-up-form').then((m) => m.SignUpForm);

/**
 * Lazy loads the user administration view component.
 *
 * @returns A Promise that resolves to the UserList component
 */
const userList = () => import('./views/user-list/user-list').then((m) => m.UserList);

/**
 * Base title used by IAM routes.
 */
const baseTitle = 'BevTrace';

/**
 * Routing configuration for the Identity and Access Management bounded context.
 *
 * @remarks
 * These routes expose authentication views and the administrator-only user
 * management view. Authentication screens render their own public toolbar and
 * therefore do not use the main application layout.
 */
export const iamRoutes: Routes = [
  { path: 'sign-in', loadComponent: signInForm, title: `Sign In | ${baseTitle}` },
  { path: 'sign-up', loadComponent: signUpForm, title: `Sign Up | ${baseTitle}` },
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard, roleGuard('ROLE_ADMIN')],
    children: [
      { path: 'users', loadComponent: userList, title: `Users & Roles | ${baseTitle}` },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
    ],
  },
];
