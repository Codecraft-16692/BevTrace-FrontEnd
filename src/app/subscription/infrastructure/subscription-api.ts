import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';

import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { Subscription } from '../domain/model/subscription.entity';
import { Payment } from '../domain/model/payment.entity';
import { NewsletterSubscriber } from '../domain/model/newsletter-subscriber.entity';
import { ContactRequest } from '../domain/model/contact-request.entity';

import { SubscriptionPlanApiEndpoint } from './subscription-plan-api-endpoint';
import { SubscriptionApiEndpoint } from './subscription-api-endpoint';
import { PaymentApiEndpoint } from './payment-api-endpoint';
import { NewsletterSubscriberApiEndpoint } from './newsletter-subscriber-api-endpoint';
import { ContactRequestApiEndpoint } from './contact-request-api-endpoint';

import { CreateSubscriptionRequest } from './subscription.request';
import { CreatePaymentRequest } from './payment.request';
import { CreateNewsletterSubscriberRequest } from './newsletter-subscriber.request';
import { CreateContactRequestRequest } from './contact-request.request';

/**
 * HTTP API facade for the Subscription bounded context.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over plan, subscription, payment,
 * newsletter and contact request endpoint clients. The payment gateway is
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
   * Endpoint client for newsletter subscribers.
   */
  private readonly newsletterEndpoint: NewsletterSubscriberApiEndpoint;

  /**
   * Endpoint client for contact requests.
   */
  private readonly contactEndpoint: ContactRequestApiEndpoint;

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
    this.newsletterEndpoint = new NewsletterSubscriberApiEndpoint(http);
    this.contactEndpoint = new ContactRequestApiEndpoint(http);
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
   * Creates a subscription.
   *
   * @param request - Subscription creation payload
   * @returns Observable stream emitting the created Subscription
   */
  createSubscription(request: CreateSubscriptionRequest): Observable<Subscription> {
    return this.subscriptionEndpoint.createFromRequest(request);
  }

  /**
   * Cancels a subscription.
   *
   * @param id - Identifier of the subscription
   * @returns Observable stream emitting the updated Subscription
   */
  cancelSubscription(id: number): Observable<Subscription> {
    return this.subscriptionEndpoint.patch(id, {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
    });
  }

  /**
   * Retrieves every payment.
   *
   * @returns Observable stream emitting Payment entities
   */
  getPayments(): Observable<Payment[]> {
    return this.paymentEndpoint.getAll();
  }

  /**
   * Creates a payment.
   *
   * @param request - Payment creation payload
   * @returns Observable stream emitting the created Payment
   */
  createPayment(request: CreatePaymentRequest): Observable<Payment> {
    return this.paymentEndpoint.createFromRequest(request);
  }

  /**
   * Retrieves every newsletter subscriber.
   *
   * @returns Observable stream emitting NewsletterSubscriber entities
   */
  getSubscribers(): Observable<NewsletterSubscriber[]> {
    return this.newsletterEndpoint.getAll();
  }

  /**
   * Retrieves the subscribers registered with an e-mail.
   *
   * @param email - E-mail address to look up
   * @returns Observable stream emitting the matching NewsletterSubscriber entities
   */
  findSubscribersByEmail(email: string): Observable<NewsletterSubscriber[]> {
    return this.newsletterEndpoint.getByQuery({ email });
  }

  /**
   * Creates a newsletter subscriber.
   *
   * @param request - Subscriber creation payload
   * @returns Observable stream emitting the created NewsletterSubscriber
   */
  createSubscriber(request: CreateNewsletterSubscriberRequest): Observable<NewsletterSubscriber> {
    return this.newsletterEndpoint.createFromRequest(request);
  }

  /**
   * Retrieves every contact request.
   *
   * @returns Observable stream emitting ContactRequest entities
   */
  getContactRequests(): Observable<ContactRequest[]> {
    return this.contactEndpoint.getAll();
  }

  /**
   * Creates a contact request.
   *
   * @param request - Contact request creation payload
   * @returns Observable stream emitting the created ContactRequest
   */
  createContactRequest(request: CreateContactRequestRequest): Observable<ContactRequest> {
    return this.contactEndpoint.createFromRequest(request);
  }
}
