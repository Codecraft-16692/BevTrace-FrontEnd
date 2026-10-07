import { Component, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { SubscriptionPlan } from '../../../domain/model/subscription-plan.entity';

/**
 * Component that renders one commercial plan as a pricing card.
 *
 * @remarks
 * This presentation component is shared by the landing page and the plans view.
 * It shows the price, the translated features and emits the plan when the user
 * chooses it, so each host decides what to do (register, checkout or contact).
 */
@Component({
  selector: 'app-plan-card',
  standalone: true,
  imports: [DecimalPipe, TranslateModule, MatIconModule],
  templateUrl: './plan-card.html',
  styleUrl: './plan-card.css',
})
export class PlanCard {
  /**
   * Plan rendered by the card.
   */
  readonly plan = input.required<SubscriptionPlan>();

  /**
   * Translation key of the action button.
   */
  readonly actionKey = input<string>('plans.start-trial');

  /**
   * Emits the plan when the action button is pressed.
   */
  readonly chosen = output<SubscriptionPlan>();
}
