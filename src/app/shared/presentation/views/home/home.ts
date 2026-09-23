import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { MessageBanner } from '../../components/message-banner/message-banner';
import { IamStore } from '../../../../iam/application/iam.store';
import { SubscriptionStore } from '../../../../subscription/application/subscription.store';
import { SubscriptionPlan } from '../../../../subscription/domain/model/subscription-plan.entity';
import { PlanCard } from '../../../../subscription/presentation/components/plan-card/plan-card';
import { emailFormatValidator } from '../../../../iam/presentation/validators/credentials.validators';

/**
 * Team member displayed in the landing page.
 */
interface TeamMember {
  /**
   * Key used to build the translation keys and the photo path.
   */
  key: string;

  /**
   * Full name of the member.
   */
  name: string;
}

/**
 * Component that renders the public landing page of BevTrace.
 *
 * @remarks
 * This presentation component follows the landing page mockup: hero with the
 * segment selector, traceability shift, mission-critical features, pricing with
 * monthly and yearly billing, the CodeCraft team, the contact form and the
 * newsletter subscription.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    DecimalPipe,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
    MatIconModule,
    MessageBanner,
    PlanCard,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  /**
   * Store that exposes the authenticated session.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Store that manages plans, newsletter and contact requests.
   */
  protected readonly subscriptionStore = inject(SubscriptionStore);

  /**
   * Router used to navigate to the registration.
   */
  private readonly router = inject(Router);

  /**
   * Translation service used by the language toggle of the navigation bar.
   */
  private readonly translate = inject(TranslateService);

  /**
   * Language currently applied.
   */
  protected readonly lang = signal<string>(this.translate.getCurrentLang() || 'en');

  /**
   * Section highlighted in the navigation bar.
   */
  protected readonly active = signal<string>('home');

  /**
   * Sections linked from the navigation bar.
   */
  protected readonly links = [
    { id: 'home', key: 'home' },
    { id: 'about', key: 'about' },
    { id: 'features', key: 'features' },
    { id: 'plans', key: 'plans' },
    { id: 'team', key: 'team' },
    { id: 'contact', key: 'contact' },
  ];

  /**
   * Audience segment selected in the audience section.
   */
  protected readonly segment = signal<'manager' | 'driver'>('manager');

  /**
   * Billing cycle selected in the pricing section.
   */
  protected readonly cycle = signal<'MONTHLY' | 'YEARLY'>('MONTHLY');

  /**
   * Features of the mission-critical section as pairs of icon and translation key.
   */
  protected readonly features = [
    { icon: 'layers', key: 'queue' },
    { icon: 'place', key: 'map' },
    { icon: 'verified_user', key: 'classification' },
    { icon: 'bar_chart', key: 'kpi' },
    { icon: 'inventory', key: 'catalog' },
  ];

  /**
   * Members of the CodeCraft team.
   */
  protected readonly team: TeamMember[] = [
    { key: 'mauricio', name: 'Mauricio Castillo Yataco' },
    { key: 'danitza', name: 'Danitza Heredia Hoyos' },
    { key: 'enrique', name: 'Enrique Ochoa Prado' },
  ];

  /**
   * Reactive form used to capture the newsletter e-mail.
   */
  protected readonly newsletterForm = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, emailFormatValidator()],
    }),
  });

  /**
   * Reactive form used to capture a contact request.
   */
  protected readonly contactForm = new FormGroup({
    fullName: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
    email: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, emailFormatValidator()] }),
    company: new FormControl<string>('', { nonNullable: true }),
    message: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(10)] }),
  });

  /**
   * Lifecycle hook that loads the plans shown in the pricing section.
   */
  ngOnInit(): void {
    this.subscriptionStore.loadPlans();
  }

  /**
   * Applies and persists the language chosen in the navigation bar.
   *
   * @param language - Language code selected by the visitor
   */
  protected setLanguage(language: string): void {
    this.translate.use(language);
    this.lang.set(language);
    localStorage.setItem('bevtrace.lang', language);
  }

  /**
   * Continues with a plan: enterprise goes to the contact form, others to the registration.
   *
   * @param plan - Plan chosen by the visitor
   */
  protected choosePlan(plan: SubscriptionPlan): void {
    if (plan.custom) {
      this.router.navigate(['/home'], { fragment: 'contact' }).then();
      return;
    }
    if (this.iamStore.isSignedIn()) {
      this.router
        .navigate(['/subscriptions/checkout'], { queryParams: { plan: plan.code, cycle: plan.billingPeriod } })
        .then();
      return;
    }
    this.router.navigate(['/iam/sign-up']).then();
  }

  /**
   * Submits the newsletter form.
   */
  protected onSubscribe(): void {
    if (this.newsletterForm.invalid) {
      this.newsletterForm.markAllAsTouched();
      return;
    }
    this.subscriptionStore.subscribeNewsletter({ email: this.newsletterForm.controls.email.value });
    this.newsletterForm.reset({ email: '' });
  }

  /**
   * Submits the contact form.
   */
  protected onContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.subscriptionStore.submitContactRequest(this.contactForm.getRawValue());
    this.contactForm.reset({ fullName: '', email: '', company: '', message: '' });
  }
}
