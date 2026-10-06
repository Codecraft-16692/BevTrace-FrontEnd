import { Component, OnInit, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { SubscriptionStore } from '../../../application/subscription.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that shows the subscription and the payments of the signed in user.
 *
 * @remarks
 * This presentation component shows the active plan, its renewal date and the
 * payment history, and allows cancelling the subscription. Users without a
 * subscription are invited to choose a plan.
 */
@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [DatePipe, DecimalPipe, TranslateModule, MatIconModule, MessageBanner, StatusChip],
  templateUrl: './billing.html',
  styleUrl: './billing.css',
})
export class Billing implements OnInit {
  /**
   * Store that manages subscription state.
   */
  protected readonly store = inject(SubscriptionStore);

  /**
   * Store that exposes the signed in user.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * Router used to navigate to the plans.
   */
  private readonly router = inject(Router);

  /**
   * Current subscription of the signed in user.
   */
  protected readonly current = computed(() => {
    this.store.subscriptions();
    return this.store.currentOf(this.iamStore.currentUserId());
  });

  /**
   * Lifecycle hook that loads the subscription data.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Cancels the current subscription.
   *
   * @param subscriptionId - Identifier of the subscription
   */
  protected onCancel(subscriptionId: number): void {
    this.store.cancelSubscription({ subscriptionId });
  }

  /**
   * Opens the plans view.
   */
  protected viewPlans(): void {
    this.router.navigate(['/subscriptions/plans']).then();
  }
}
