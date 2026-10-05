import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { SubscriptionStore } from '../../../application/subscription.store';
import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';
import { PlanCard } from '../../components/plan-card/plan-card';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component that lists the commercial plans for the signed in user.
 *
 * @remarks
 * This presentation component lets the user compare the plans, switch between
 * monthly and yearly billing and continue to the checkout. The enterprise plan
 * redirects to the landing page contact form.
 */
@Component({
  selector: 'app-plan-list',
  standalone: true,
  imports: [TranslateModule, MatIconModule, PlanCard, MessageBanner],
  templateUrl: './plan-list.html',
  styleUrl: './plan-list.css',
})
export class PlanList implements OnInit {
  /**
   * Store that manages subscription state.
   */
  protected readonly store = inject(SubscriptionStore);

  /**
   * Router used to navigate to the checkout.
   */
  private readonly router = inject(Router);

  /**
   * Billing cycle selected by the user.
   */
  protected readonly cycle = signal<'MONTHLY' | 'YEARLY'>('MONTHLY');

  /**
   * Lifecycle hook that loads the plans.
   */
  ngOnInit(): void {
    this.store.loadPlans();
  }

  /**
   * Continues with the chosen plan.
   *
   * @param plan - Plan chosen by the user
   */
  protected choose(plan: SubscriptionPlan): void {
    if (plan.custom) {
      this.router.navigate(['/home'], { fragment: 'contact' }).then();
      return;
    }
    this.router
      .navigate(['/subscriptions/checkout'], { queryParams: { plan: plan.code, cycle: plan.billingPeriod } })
      .then();
  }
}
