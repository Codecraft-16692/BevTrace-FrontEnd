import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';

import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { Subscription } from '../domain/model/subscription.entity';
import { Payment } from '../domain/model/payment.entity';

import { SubscriptionPlanApiEndpoint } from './subscription-plan-api-endpoint';
import { SubscriptionApiEndpoint } from './subscription-api-endpoint';
import { PaymentApiEndpoint } from './payment-api-endpoint';

import { SubscribeRequest } from './subscription.request';

/**
 * HTTP API facade for the Subscription bounded context.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over plan, subscription and payment
 * endpoint clients. The payment gateway is
 * simulated: only the last four digits of the card are persisted.
 */
@Injectable({ providedIn: 'root' })
export class SubscriptionApi extends BaseApi {
  /**
   * Endpoint client for subscription plans.
   */
  private readonly planEndpoint: SubscriptionPlanApiEndpoint;

  /**
   * Endpoint client for subscriptions.
   */
  private readonly subscriptionEndpoint: SubscriptionApiEndpoint;

  /**
   * Endpoint client for payments.
   */
  private readonly paymentEndpoint: PaymentApiEndpoint;

  /**
   * Creates a new SubscriptionApi facade.
   *
   * @param http - Angular HttpClient used by endpoint clients
   */
  constructor(http: HttpClient) {
    super();
    this.planEndpoint = new SubscriptionPlanApiEndpoint(http);
    this.subscriptionEndpoint = new SubscriptionApiEndpoint(http);
    this.paymentEndpoint = new PaymentApiEndpoint(http);
  }

  /**
   * Retrieves every subscription plan.
   *
   * @returns Observable stream emitting SubscriptionPlan entities
   */
  getPlans(): Observable<SubscriptionPlan[]> {
    return this.planEndpoint.getAll();
  }

  /**
   * Retrieves every subscription.
   *
   * @returns Observable stream emitting Subscription entities
   */
  getSubscriptions(): Observable<Subscription[]> {
    return this.subscriptionEndpoint.getAll();
  }

  /**
   * Subscribes to a plan (POST /subscriptions). The backend charges the payment.
   *
   * @param request - Company, plan and card data
   * @returns Observable emitting the created subscription
   */
  subscribe(request: SubscribeRequest): Observable<Subscription> {
    return this.subscriptionEndpoint.createFromRequest(request);
  }

  /**
   * Cancels a subscription (POST /subscriptions/{id}/cancellations).
   *
   * @param id - Subscription identifier
   * @returns Observable completing when it was cancelled
   */
  cancelSubscription(id: number): Observable<void> {
    return this.subscriptionEndpoint.command('POST', `${id}/cancellations`);
  }

  /**
   * Retrieves every payment.
   *
   * @returns Observable stream emitting Payment entities
   */
  getPayments(): Observable<Payment[]> {
    return this.paymentEndpoint.getAll();
  }

}
