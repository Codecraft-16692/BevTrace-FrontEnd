import { Routes } from '@angular/router';
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
 * Public authentication routes.
 *
 * @remarks
 * Authentication screens render their own public toolbar and therefore are not
 * placed inside the main application layout.
 */
export const authRoutes: Routes = [
  { path: 'iam/sign-in', loadComponent: signInForm, title: `Sign In | ${baseTitle}` },
  { path: 'iam/sign-up', loadComponent: signUpForm, title: `Sign Up | ${baseTitle}` },
];

/**
 * Administrator-only routes of the Identity and Access Management context.
 *
 * @remarks
 * The resource is the plural `users`, mounted under `/iam`.
 */
export const userRoutes: Routes = [
  {
    path: 'iam/users',
    loadComponent: userList,
    canActivate: [roleGuard('ROLE_ADMIN')],
    title: `Users & Roles | ${baseTitle}`,
  },
];
