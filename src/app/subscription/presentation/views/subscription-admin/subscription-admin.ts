import { Component, OnInit, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { SubscriptionStore } from '../../../application/subscription.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that shows the subscriptions, prospects and access data to administrators.
 *
 * @remarks
 * This presentation component is the administration overview that joins the
 * Subscription and IAM contexts: it lists every subscription with its owner,
 * the revenue, the newsletter subscribers and the contact requests, and shows
 * the amount of users per role.
 */
@Component({
  selector: 'app-subscription-admin',
  standalone: true,
  imports: [DatePipe, DecimalPipe, TranslateModule, MatIconModule, MessageBanner, StatusChip],
  templateUrl: './subscription-admin.html',
  styleUrl: './subscription-admin.css',
})
export class SubscriptionAdmin implements OnInit {
  /**
   * Store that manages subscription state.
   */
  protected readonly store = inject(SubscriptionStore);

  /**
   * Store that exposes the users and roles of the IAM context.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Lifecycle hook that loads subscriptions, users and roles.
   */
  ngOnInit(): void {
    this.store.loadAll();
    this.iamStore.loadUsers();
    this.iamStore.loadRoles();
  }

  /**
   * Counts the users that hold a role.
   *
   * @param roleId - Identifier of the role
   * @returns Number of users holding the role
   */
  protected usersWithRole(roleId: number): number {
    return this.iamStore.users().filter((user) => user.roleId === roleId).length;
  }
}
