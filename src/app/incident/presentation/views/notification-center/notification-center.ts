import { Component, OnInit, computed, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { IncidentStore } from '../../../application/incident.store';
import { IamStore } from '../../../../iam/application/iam.store';

/**
 * Component that lists the in-app notifications of the signed in user.
 *
 * @remarks
 * This presentation component shows the notifications addressed to the role of
 * the user (incidents, inventory discrepancies, dispatch authorizations and
 * device reconnections) and lets the user mark them as read.
 */
@Component({
  selector: 'app-notification-center',
  standalone: true,
  imports: [DatePipe, TranslateModule, MatIconModule],
  templateUrl: './notification-center.html',
  styleUrl: './notification-center.css',
})
export class NotificationCenter implements OnInit {
  /**
   * Store that manages incident and notification state.
   */
  protected readonly store = inject(IncidentStore);

  /**
   * Store that exposes the signed in user.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * Notifications addressed to the roles of the user.
   */
  protected readonly visible = computed(() =>
    this.store
      .notifications()
      .filter((n) => n.recipientRole === 'ALL' || this.iamStore.hasAnyRole([n.recipientRole])),
  );

  /**
   * Lifecycle hook that loads the notifications.
   */
  ngOnInit(): void {
    this.store.loadNotifications();
  }

  /**
   * Resolves the Material icon of a notification category.
   *
   * @param type - Notification category
   * @returns Material icon identifier
   */
  protected iconOf(type: string): string {
    const icons: Record<string, string> = {
      INCIDENT: 'warning_amber',
      INVENTORY: 'inventory_2',
      DISPATCH: 'local_shipping',
      TELEMETRY: 'sensors',
    };
    return icons[type] ?? 'notifications';
  }
}
