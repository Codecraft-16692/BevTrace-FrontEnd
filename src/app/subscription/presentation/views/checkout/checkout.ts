import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { SubscriptionStore } from '../../../application/subscription.store';
import { CardPolicy } from '../../../domain/model/card-policy';
import { IamStore } from '../../../../iam/application/iam.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component that simulates the payment of a subscription.
 *
 * @remarks
 * This presentation component validates the card number (length and Luhn
 * checksum) and delegates the simulated charge to the store. The card number is
 * never persisted, only its last four digits. Use 4242 4242 4242 4242 for an
 * approved payment and 4000 0000 0000 0002 for a declined one.
 */
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [DecimalPipe, ReactiveFormsModule, TranslateModule, MatIconModule, MessageBanner],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  /**
   * Store that manages subscription state.
   */
  protected readonly store = inject(SubscriptionStore);

  /**
   * Store that exposes the signed in user.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * Route that exposes the selected plan.
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Router used to navigate after the payment.
   */
  private readonly router = inject(Router);

  /**
   * Code of the selected plan.
   */
  protected readonly planCode = signal<string>('');

  /**
   * Billing cycle of the selected plan.
   */
  protected readonly cycle = signal<'MONTHLY' | 'YEARLY'>('MONTHLY');

  /**
   * Plan selected by the user.
   */
  protected readonly plan = computed(() =>
    this.store.plans().find((item) => item.code === this.planCode() && item.billingPeriod === this.cycle()),
  );

  /**
   * Reactive form used to capture the payment data.
   */
  protected readonly form = new FormGroup({
    companyName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    cardHolder: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    cardNumber: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[0-9 -]{16,23}$/)],
    }),
  });

  /**
   * Lifecycle hook that loads the plans and reads the selected plan.
   */
  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.planCode.set(params.get('plan') ?? '');
    this.cycle.set(params.get('cycle') === 'YEARLY' ? 'YEARLY' : 'MONTHLY');
    this.store.loadAll();
  }

  /**
   * Submits the payment form.
   */
  protected onSubmit(): void {
    if (this.form.invalid || !CardPolicy.isValid(this.form.controls.cardNumber.value)) {
      this.form.markAllAsTouched();
      this.form.controls.cardNumber.setErrors({ luhn: true });
      return;
    }
    const value = this.form.getRawValue();
    this.store.subscribeToPlan(
      {
        userId: this.iamStore.currentUserId() ?? 0,
        companyName: value.companyName,
        planCode: this.planCode(),
        billingCycle: this.cycle(),
        cardHolder: value.cardHolder,
        cardNumber: value.cardNumber,
      },
      () => this.router.navigate(['/subscriptions/billing']).then(),
    );
  }
}
