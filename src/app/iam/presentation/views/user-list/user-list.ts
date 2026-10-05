import { Component, OnInit, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { IamStore } from '../../../application/iam.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component responsible for the administration of users and roles.
 *
 * @remarks
 * This presentation component is only reachable by administrators. It lists
 * every registered user and allows changing the assigned role or enabling and
 * disabling the account. The administrator cannot edit its own account.
 */
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatSelectModule,
    MatSlideToggleModule,
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
  protected readonly displayedColumns = ['name', 'email', 'role', 'status', 'createdAt'];

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
   * Changes the role of a user.
   *
   * @param userId - Identifier of the user
   * @param roleId - Identifier of the new role
   */
  protected onRoleChange(userId: number, roleId: number): void {
    this.store.assignRole({ userId, roleId });
  }

  /**
   * Enables or disables a user account.
   *
   * @param userId - Identifier of the user
   * @param active - New activation state
   */
  protected onStatusChange(userId: number, active: boolean): void {
    this.store.setUserActive({ userId, active });
  }
}
