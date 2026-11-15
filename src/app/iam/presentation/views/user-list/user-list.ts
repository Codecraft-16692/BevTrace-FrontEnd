import { Component, OnInit, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { IamStore } from '../../../application/iam.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component responsible for granting and revoking access to the platform.
 *
 * @remarks
 * This presentation component is reachable by logistics managers and administrators. New accounts
 * wait here with the account disabled: granting a permission assigns the role and enables the
 * account, and revoking the access disables it. The logistics manager only sees and manages the
 * warehouse operators; the administrator manages every user. Nobody can edit its own account.
 */
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MessageBanner,
  ],
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit {
  /**
   * Store that manages Identity and Access Management state.
   */
  protected readonly store = inject(IamStore);

  /**
   * Columns displayed in the users table.
   */
  protected readonly displayedColumns = ['name', 'email', 'role', 'status', 'createdAt', 'actions'];

  /**
   * Lifecycle hook that loads users and roles.
   */
  ngOnInit(): void {
    this.store.loadUsers();
    this.store.loadRoles();
  }

  /**
   * Counts the users that hold a given role.
   *
   * @param roleId - Identifier of the role
   * @returns Number of users holding the role
   */
  protected countByRole(roleId: number): number {
    return this.store.users().filter((user) => user.roleId === roleId).length;
  }

  /**
   * Role chosen in the select of each user, by user identifier, before granting it.
   */
  private readonly chosenRoles = signal<Record<number, number>>({});

  /**
   * Remembers the role chosen for a user. It is applied when the permission is granted.
   *
   * @param userId - Identifier of the user
   * @param roleId - Identifier of the chosen role
   */
  protected onRoleChange(userId: number, roleId: number): void {
    this.chosenRoles.update((chosen) => ({ ...chosen, [userId]: roleId }));
  }

  /**
   * Gives the role shown in the select of a user: the chosen one or the current one.
   *
   * @param userId        - Identifier of the user
   * @param currentRoleId - Role the user holds now
   * @returns Identifier of the role to show
   */
  protected roleOf(userId: number, currentRoleId: number): number {
    return this.chosenRoles()[userId] ?? currentRoleId;
  }

  /**
   * Grants the chosen (or current) role to a user and enables the account.
   *
   * @param userId        - Identifier of the user
   * @param currentRoleId - Role the user holds now
   */
  protected onGrant(userId: number, currentRoleId: number): void {
    this.store.grantPermission({ userId, roleId: this.roleOf(userId, currentRoleId) });
  }

  /**
   * Revokes the access of a user.
   *
   * @param userId - Identifier of the user
   */
  protected onRevoke(userId: number): void {
    this.store.revokeAccess({ userId });
  }
}
