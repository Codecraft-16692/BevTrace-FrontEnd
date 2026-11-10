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

import { SubscribeRequest } from './subscription.request';
import { SubmitContactRequest } from './contact-request.request';

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
   * Subscribes to a plan (POST /subscriptions). The backend charges the payment.
   *
   * @param request - Company, plan and card data
   * @returns Observable emitting the created subscription
   */
  subscribe(request: SubscribeRequest): Observable<Subscription> {
    return this.subscriptionEndpoint.createFromRequest(request);
  }

  /**
   * Cancels a subscription (POST /subscriptions/{id}/cancellation).
   *
   * @param id - Subscription identifier
   * @returns Observable completing when it was cancelled
   */
  cancelSubscription(id: number): Observable<void> {
    return this.subscriptionEndpoint.command('POST', `${id}/cancellation`);
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
   * Retrieves every newsletter subscriber.
   *
   * @returns Observable stream emitting NewsletterSubscriber entities
   */
  getSubscribers(): Observable<NewsletterSubscriber[]> {
    return this.newsletterEndpoint.getAll();
  }


  /**
   * Subscribes an e-mail to the newsletter (POST /newsletter-subscribers).
   *
   * @param email - E-mail address
   * @returns Observable emitting the created subscriber
   */
  subscribeNewsletter(email: string): Observable<NewsletterSubscriber> {
    return this.newsletterEndpoint.createFromRequest({ email });
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
   * Sends a contact request (POST /contact-requests).
   *
   * @param request - Contact data
   * @returns Observable emitting the created request
   */
  submitContactRequest(request: SubmitContactRequest): Observable<ContactRequest> {
    return this.contactEndpoint.createFromRequest(request);
  }
}
