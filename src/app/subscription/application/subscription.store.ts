import { computed, inject, Injectable, signal } from '@angular/core';
import { defer, forkJoin, map, switchMap, throwError } from 'rxjs';

import { BaseStore } from '../../shared/application/base-store';
import { BusinessError } from '../../shared/domain/model/business-error';
import { CredentialsPolicy } from '../../iam/domain/model/credentials-policy';

import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { Subscription } from '../domain/model/subscription.entity';
import { Payment } from '../domain/model/payment.entity';
import { NewsletterSubscriber } from '../domain/model/newsletter-subscriber.entity';
import { ContactRequest } from '../domain/model/contact-request.entity';
import { CardPolicy, DECLINED_TEST_CARD } from '../domain/model/card-policy';
import { SubscribeToPlanCommand } from '../domain/model/subscribe-to-plan.command';
import { CancelSubscriptionCommand } from '../domain/model/cancel-subscription.command';
import { SubscribeNewsletterCommand } from '../domain/model/subscribe-newsletter.command';
import { SubmitContactRequestCommand } from '../domain/model/submit-contact-request.command';

import { SubscriptionApi } from '../infrastructure/subscription-api';

/**
 * Signal-based application store for the Subscription bounded context.
 *
 * @remarks
 * This store exposes the commercial plans shown in the landing page and the
 * plans view, simulates the checkout (card validation, declined payment and
 * activation), lists the subscriptions and payments and manages the newsletter
 * and contact requests of prospects.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionStore extends BaseStore {
  /**
   * API facade used to reach the subscription endpoints.
   */
  private readonly api = inject(SubscriptionApi);

  /**
   * Internal signal containing the plans.
   */
  private readonly plansSignal = signal<SubscriptionPlan[]>([]);

  /**
   * Internal signal containing the subscriptions.
   */
  private readonly subscriptionsSignal = signal<Subscription[]>([]);

  /**
   * Internal signal containing the payments.
   */
  private readonly paymentsSignal = signal<Payment[]>([]);

  /**
   * Internal signal containing the newsletter subscribers.
   */
  private readonly subscribersSignal = signal<NewsletterSubscriber[]>([]);

  /**
   * Internal signal containing the contact requests.
   */
  private readonly contactsSignal = signal<ContactRequest[]>([]);

  /**
   * Readonly signal exposing the plans.
   */
  readonly plans = this.plansSignal.asReadonly();

  /**
   * Readonly signal exposing the subscriptions, newest period first.
   */
  readonly subscriptions = computed(() =>
    [...this.subscriptionsSignal()].sort((a, b) => b.currentPeriodStart.localeCompare(a.currentPeriodStart)),
  );

  /**
   * Readonly signal exposing the payments, newest first.
   */
  readonly payments = computed(() =>
    [...this.paymentsSignal()].sort((a, b) => b.paidAt.localeCompare(a.paidAt)),
  );

  /**
   * Readonly signal exposing the newsletter subscribers, newest first.
   */
  readonly subscribers = computed(() =>
    [...this.subscribersSignal()].sort((a, b) => b.subscribedAt.localeCompare(a.subscribedAt)),
  );

  /**
   * Readonly signal exposing the contact requests, newest first.
   */
  readonly contactRequests = computed(() =>
    [...this.contactsSignal()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );

  /**
   * Number of active subscriptions.
   */
  readonly activeCount = computed(
    () => this.subscriptionsSignal().filter((subscription) => subscription.status === 'ACTIVE').length,
  );

  /**
   * Revenue of the payments that were charged successfully.
   */
  readonly revenue = computed(() =>
    this.paymentsSignal()
      .filter((payment) => payment.status === 'PAID')
      .reduce((sum, payment) => sum + payment.amount, 0),
  );

  /**
   * Loads only the plans, used by public views.
   */
  loadPlans(): void {
    this.read(this.api.getPlans(), 'subscription.errors.load', (plans) => this.plansSignal.set(plans));
  }

  /**
   * Loads every subscription collection.
   */
  loadAll(): void {
    this.read(
      forkJoin({
        plans: this.api.getPlans(),
        subscriptions: this.api.getSubscriptions(),
        payments: this.api.getPayments(),
        subscribers: this.api.getSubscribers(),
        contacts: this.api.getContactRequests(),
      }),
      'subscription.errors.load',
      (result) => {
        this.plansSignal.set(result.plans);
        this.subscriptionsSignal.set(result.subscriptions);
        this.paymentsSignal.set(result.payments);
        this.subscribersSignal.set(result.subscribers);
        this.contactsSignal.set(result.contacts);
      },
    );
  }

  /**
   * Returns the plans of a billing cycle.
   *
   * @param cycle - Billing cycle to filter
   * @returns Active plans of the cycle
   */
  plansOf(cycle: 'MONTHLY' | 'YEARLY'): SubscriptionPlan[] {
    return this.plansSignal().filter((plan) => plan.active && plan.billingPeriod === cycle);
  }

  /**
   * Returns the current subscription of a user.
   *
   * @param userId - Identifier of the user
   * @returns The active or past due subscription, if any
   */
  currentOf(userId: number | null): Subscription | undefined {
    return this.subscriptions().find(
      (subscription) =>
        subscription.userId === userId && (subscription.status === 'ACTIVE' || subscription.status === 'PAST_DUE'),
    );
  }

  /**
   * Returns the payments of a subscription.
   *
   * @param subscriptionId - Identifier of the subscription
   * @returns Payments of the subscription, newest first
   */
  paymentsOf(subscriptionId: number): Payment[] {
    return this.payments().filter((payment) => payment.subscriptionId === subscriptionId);
  }

  /**
   * Pays and activates a subscription with the simulated gateway.
   *
   * @param command - Command containing the plan, company and card data
   * @param onSubscribed - Callback executed when the subscription is active
   */
  subscribeToPlan(command: SubscribeToPlanCommand, onSubscribed?: () => void): void {
    const operation = defer(() => {
      const plan = this.plansSignal().find(
        (item) => item.code === command.planCode && item.billingPeriod === command.billingCycle,
      );
      if (!plan || plan.custom) {
        return throwError(() => new BusinessError('subscription.errors.plan-not-purchasable'));
      }
      if (command.cardHolder.trim().length < 3) {
        return throwError(() => new BusinessError('subscription.errors.holder-required'));
      }
      if (!CardPolicy.isValid(command.cardNumber)) {
        return throwError(() => new BusinessError('subscription.errors.card-invalid'));
      }
      if (this.currentOf(command.userId)) {
        return throwError(() => new BusinessError('subscription.errors.already-active'));
      }

      const last4 = CardPolicy.last4(command.cardNumber);
      const now = new Date();

      if (CardPolicy.normalize(command.cardNumber) === DECLINED_TEST_CARD) {
        return this.api
          .createSubscription({
            userId: command.userId,
            companyName: command.companyName.trim(),
            planCode: plan.code,
            billingCycle: plan.billingPeriod,
            status: 'PENDING',
            currentPeriodStart: now.toISOString(),
            currentPeriodEnd: now.toISOString(),
            cancelledAt: null,
          })
          .pipe(
            switchMap((subscription) =>
              this.api.createPayment({
                subscriptionId: subscription.id,
                amount: plan.priceAmount,
                currency: plan.currency,
                status: 'FAILED',
                cardLast4: last4,
                paidAt: now.toISOString(),
              }),
            ),
            switchMap(() => throwError(() => new BusinessError('subscription.errors.payment-declined'))),
          );
      }

      const end = new Date(now);
      if (plan.billingPeriod === 'MONTHLY') end.setMonth(end.getMonth() + 1);
      else end.setFullYear(end.getFullYear() + 1);

      return this.api
        .createSubscription({
          userId: command.userId,
          companyName: command.companyName.trim(),
          planCode: plan.code,
          billingCycle: plan.billingPeriod,
          status: 'ACTIVE',
          currentPeriodStart: now.toISOString(),
          currentPeriodEnd: end.toISOString(),
          cancelledAt: null,
        })
        .pipe(
          switchMap((subscription) =>
            this.api
              .createPayment({
                subscriptionId: subscription.id,
                amount: plan.priceAmount,
                currency: plan.currency,
                status: 'PAID',
                cardLast4: last4,
                paidAt: now.toISOString(),
              })
              .pipe(map(() => subscription)),
          ),
        );
    });

    this.write(
      operation,
      'subscription.errors.generic',
      () => {
        this.loadAllSilently();
        onSubscribed?.();
      },
      { key: 'subscription.checkout.success' },
    );
  }

  /**
   * Cancels a subscription.
   *
   * @param command - Command containing the subscription
   */
  cancelSubscription(command: CancelSubscriptionCommand): void {
    this.write(
      this.api.cancelSubscription(command.subscriptionId),
      'subscription.errors.generic',
      () => this.loadAllSilently(),
      { key: 'subscription.billing.cancelled' },
    );
  }

  /**
   * Subscribes an e-mail to the commercial newsletter.
   *
   * @param command - Command containing the e-mail
   */
  subscribeNewsletter(command: SubscribeNewsletterCommand): void {
    const email = command.email.trim().toLowerCase();

    const operation = defer(() => {
      if (!CredentialsPolicy.isValidEmail(email)) {
        return throwError(() => new BusinessError('subscription.errors.email-invalid'));
      }
      return this.api.findSubscribersByEmail(email).pipe(
        switchMap((existing) =>
          existing.length > 0
            ? throwError(() => new BusinessError('subscription.errors.newsletter-duplicated'))
            : this.api.createSubscriber({ email, subscribedAt: new Date().toISOString() }),
        ),
      );
    });

    this.write(operation, 'subscription.errors.generic', () => undefined, {
      key: 'subscription.newsletter.success',
    });
  }

  /**
   * Sends a commercial contact request.
   *
   * @param command - Command containing the visitor data and the message
   */
  submitContactRequest(command: SubmitContactRequestCommand): void {
    const operation = defer(() => {
      if (!CredentialsPolicy.isValidEmail(command.email)) {
        return throwError(() => new BusinessError('subscription.errors.email-invalid'));
      }
      if (command.fullName.trim().length < 3 || command.message.trim().length < 10) {
        return throwError(() => new BusinessError('subscription.errors.contact-incomplete'));
      }
      return this.api.createContactRequest({
        fullName: command.fullName.trim(),
        email: command.email.trim().toLowerCase(),
        company: command.company.trim(),
        message: command.message.trim(),
        createdAt: new Date().toISOString(),
      });
    });

    this.write(operation, 'subscription.errors.generic', () => undefined, {
      key: 'subscription.contact.success',
    });
  }

  /**
   * Reloads the subscription data silently after a write operation.
   */
  private loadAllSilently(): void {
    forkJoin({
      subscriptions: this.api.getSubscriptions(),
      payments: this.api.getPayments(),
    }).subscribe((result) => {
      this.subscriptionsSignal.set(result.subscriptions);
      this.paymentsSignal.set(result.payments);
    });
  }
}
