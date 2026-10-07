import { HttpErrorResponse } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

import { BaseStore } from '../../shared/application/base-store';
import { BusinessError } from '../../shared/domain/model/business-error';

import { User } from '../domain/model/user.entity';
import { Role } from '../domain/model/role.entity';
import { SignInCommand } from '../domain/model/sign-in.command';
import { SignUpCommand } from '../domain/model/sign-up.command';
import { AssignRoleCommand } from '../domain/model/assign-role.command';
import { SetUserActiveCommand } from '../domain/model/set-user-active.command';

import { IamApi } from '../infrastructure/iam-api';
import { SignInRequest } from '../infrastructure/sign-in.request';
import { SignInResource } from '../infrastructure/sign-in-response';
import { SignUpRequest } from '../infrastructure/sign-up.request';

/**
 * Authenticated session persisted in the browser.
 */
interface Session {
  /**
   * Mock access token of the session.
   */
  token: string;

  /**
   * Identifier of the authenticated user.
   */
  userId: number;

  /**
   * Full name of the authenticated user.
   */
  name: string;

  /**
   * E-mail address of the authenticated user.
   */
  email: string;

  /**
   * Authorization roles of the authenticated user.
   */
  roles: string[];

  /**
   * Epoch milliseconds when the session expires.
   */
  expiresAt: number;
}

/**
 * Local storage key used to persist the session.
 */
const SESSION_KEY = 'bevtrace.session';

/**
 * Duration of a session in hours.
 */
const SESSION_HOURS = 8;

/**
 * Failed sign-in attempts allowed before the form is temporarily locked.
 */
const MAX_FAILED_ATTEMPTS = 5;

/**
 * Seconds the sign-in form stays locked after too many failed attempts.
 */
const LOCK_SECONDS = 30;

/**
 * Signal-based application store for Identity and Access Management.
 *
 * @remarks
 * This store coordinates the presentation layer with the IAM API facade. It
 * manages the authenticated session, role based authorization checks and the
 * user administration used by the administrator role.
 */
@Injectable({ providedIn: 'root' })
export class IamStore extends BaseStore {
  /**
   * Internal signal containing the current session.
   */
  private readonly sessionSignal = signal<Session | null>(null);

  /**
   * Internal signal containing the registered users.
   */
  private readonly usersSignal = signal<User[]>([]);

  /**
   * Internal signal containing the available roles.
   */
  private readonly rolesSignal = signal<Role[]>([]);

  /**
   * Number of consecutive failed sign-in attempts.
   */
  private failedAttempts = 0;

  /**
   * Epoch milliseconds until which the sign-in form is locked.
   */
  private lockedUntil = 0;

  /**
   * Readonly signal indicating whether a user is signed in.
   */
  readonly isSignedIn = computed(() => this.sessionSignal() !== null);

  /**
   * Readonly signal exposing the current access token.
   */
  readonly currentToken = computed(() => this.sessionSignal()?.token ?? null);

  /**
   * Readonly signal exposing the current user identifier.
   */
  readonly currentUserId = computed(() => this.sessionSignal()?.userId ?? null);

  /**
   * Readonly signal exposing the current user name.
   */
  readonly currentUsername = computed(() => this.sessionSignal()?.name ?? null);

  /**
   * Readonly signal exposing the current user e-mail.
   */
  readonly currentEmail = computed(() => this.sessionSignal()?.email ?? null);

  /**
   * Readonly signal exposing the current roles.
   */
  readonly currentRoles = computed(() => this.sessionSignal()?.roles ?? []);

  /**
   * Readonly signal indicating whether the current user is an administrator.
   */
  readonly isAdmin = computed(() => this.currentRoles().includes('ROLE_ADMIN'));

  /**
   * Readonly signal exposing the translation key of the primary role.
   */
  readonly currentRoleKey = computed(() => {
    const role = this.currentRoles()[0];
    return role ? `roles.${role}` : null;
  });

  /**
   * Readonly signal exposing the initials of the current user.
   */
  readonly currentUserInitials = computed(() => {
    const name = this.currentUsername();
    if (!name) return 'U';
    return name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  });

  /**
   * Readonly signal exposing the registered users.
   */
  readonly users = this.usersSignal.asReadonly();

  /**
   * Readonly signal exposing the available roles.
   */
  readonly roles = this.rolesSignal.asReadonly();

  /**
   * Creates a new IamStore and restores the persisted session.
   *
   * @param iamApi - IAM API facade used for HTTP operations
   */
  constructor(private readonly iamApi: IamApi) {
    super();
    this.restoreSession();
  }

  /**
   * Checks whether the current user holds at least one of the given roles.
   *
   * @param roles - Roles allowed to perform an action, empty to allow any signed in user
   * @returns True for administrators or when the user holds one of the roles
   */
  hasAnyRole(roles: string[]): boolean {
    if (!this.isSignedIn()) return false;
    if (this.isAdmin() || roles.length === 0) return true;
    return roles.some((role) => this.currentRoles().includes(role));
  }

  /**
   * Authenticates a user and opens a session.
   *
   * @param command - Command containing the credentials
   * @param router - Router used to navigate after the sign-in
   * @param returnUrl - Optional URL requested before the sign-in
   */
  signIn(command: SignInCommand, router: Router, returnUrl?: string | null): void {
    this.startOperation();

    const remaining = Math.ceil((this.lockedUntil - Date.now()) / 1000);
    if (remaining > 0) {
      this.failOperation(new BusinessError('iam.errors.locked', { seconds: remaining }), '');
      return;
    }

    const request = this.toSignInRequest(command);

    this.iamApi.signIn(request).subscribe({
      next: (resource) => {
        this.failedAttempts = 0;
        this.openSession(resource);
        this.finishOperation();
        router.navigateByUrl(returnUrl || '/dashboard').then();
      },
      error: (error: unknown) => {
        this.registerFailedAttempt();
        this.failOperation(new BusinessError(this.resolveSignInErrorKey(error)), '');
      },
    });
  }

  /**
   * Registers a new user account.
   *
   * @param command - Command containing the registration data
   * @param router - Router used to navigate after the registration
   */
  signUp(command: SignUpCommand, router: Router): void {
    const request = this.toSignUpRequest(command);

    this.write(
      this.iamApi.signUp(request),
      'iam.errors.generic',
      () => router.navigate(['/iam/sign-in']).then(),
      { key: 'iam.sign-up.success' },
    );
  }

  /**
   * Closes the current session.
   *
   * @param router - Router used to navigate to the landing page
   */
  signOut(router: Router): void {
    this.clearSession();
    router.navigate(['/home']).then();
  }

  /**
   * Loads every registered user.
   */
  loadUsers(): void {
    this.read(this.iamApi.getUsers(), 'iam.errors.generic', (users) => this.usersSignal.set(users));
  }

  /**
   * Loads the available roles.
   */
  loadRoles(): void {
    this.read(this.iamApi.getRoles(), 'iam.errors.generic', (roles) => this.rolesSignal.set(roles));
  }

  /**
   * Changes the role of a user.
   *
   * @param command - Command containing the user and the new role
   */
  assignRole(command: AssignRoleCommand): void {
    if (command.userId === this.currentUserId()) {
      this.startOperation();
      this.failOperation(new BusinessError('iam.errors.cannot-edit-self'), '');
      return;
    }

    this.write(
      this.iamApi.assignRole(command.userId, command.roleId),
      'iam.errors.generic',
      (updated) => this.replaceUser(updated),
      { key: 'iam.users.role-updated' },
    );
  }

  /**
   * Enables or disables a user account.
   *
   * @param command - Command containing the user and the new activation state
   */
  setUserActive(command: SetUserActiveCommand): void {
    if (command.userId === this.currentUserId()) {
      this.startOperation();
      this.failOperation(new BusinessError('iam.errors.cannot-edit-self'), '');
      return;
    }

    this.write(
      this.iamApi.setUserActive(command.userId, command.active),
      'iam.errors.generic',
      (updated) => this.replaceUser(updated),
      { key: 'iam.users.status-updated' },
    );
  }

  /**
   * Replaces a user in the loaded list.
   *
   * @param updated - User received from the API
   */
  private replaceUser(updated: User): void {
    this.usersSignal.update((users) => users.map((user) => (user.id === updated.id ? updated : user)));
  }

  /**
   * Maps a sign-in command into an infrastructure request.
   *
   * @param command - Command created by the presentation layer
   * @returns Request ready to be sent to the API facade
   */
  private toSignInRequest(command: SignInCommand): SignInRequest {
    return {
      email: command.email.trim().toLowerCase(),
      password: command.password,
    };
  }

  /**
   * Maps a sign-up command into an infrastructure request.
   *
   * @param command - Command created by the presentation layer
   * @returns Request ready to be sent to the API facade
   */
  private toSignUpRequest(command: SignUpCommand): SignUpRequest {
    return {
      roleId: command.roleId,
      name: command.name.trim(),
      email: command.email.trim().toLowerCase(),
      phone: command.phone.trim(),
      active: true,
      createdAt: new Date().toISOString(),
      password: command.password,
    };
  }

  /**
   * Resolves the translation key of a failed sign-in.
   *
   * @param error - Error emitted by the API facade
   * @returns Translation key describing the failure
   */
  private resolveSignInErrorKey(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) return 'iam.errors.invalid-credentials';
      if (error.status === 403) return 'iam.errors.account-disabled';
    }
    return 'iam.errors.generic';
  }

  /**
   * Registers a failed attempt and locks the form when the limit is reached.
   */
  private registerFailedAttempt(): void {
    this.failedAttempts += 1;
    if (this.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      this.lockedUntil = Date.now() + LOCK_SECONDS * 1000;
      this.failedAttempts = 0;
    }
  }

  /**
   * Opens and persists a session from an authenticated resource.
   *
   * @param resource - Session resource returned by the API facade
   */
  private openSession(resource: SignInResource): void {
    const session: Session = {
      token: resource.token,
      userId: resource.id,
      name: resource.name,
      email: resource.email,
      roles: resource.roles,
      expiresAt: Date.now() + SESSION_HOURS * 3600 * 1000,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    this.sessionSignal.set(session);
  }

  /**
   * Restores the persisted session when it has not expired.
   */
  private restoreSession(): void {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return;

    try {
      const session = JSON.parse(raw) as Session;
      if (session.expiresAt > Date.now()) {
        this.sessionSignal.set(session);
        return;
      }
    } catch {
      localStorage.removeItem(SESSION_KEY);
    }
    this.clearSession();
  }

  /**
   * Removes the persisted session and resets the session state.
   */
  private clearSession(): void {
    localStorage.removeItem(SESSION_KEY);
    this.sessionSignal.set(null);
  }
}
