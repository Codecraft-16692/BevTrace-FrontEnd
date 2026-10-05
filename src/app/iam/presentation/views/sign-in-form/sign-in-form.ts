import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SignInCommand } from '../../../domain/model/sign-in.command';
import { IamStore } from '../../../application/iam.store';
import { emailFormatValidator } from '../../validators/credentials.validators';
import { Toolbar } from '../../../../shared/presentation/components/toolbar/toolbar';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component responsible for rendering and processing the sign-in form.
 *
 * @remarks
 * This standalone component belongs to the IAM presentation layer. It validates
 * the e-mail format through a reactive form, builds a SignInCommand, and
 * delegates authentication to IamStore.
 */
@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    MatProgressSpinnerModule,
    Toolbar,
    MessageBanner,
  ],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css',
})
export class SignInForm {
  /**
   * Store responsible for authentication state and operations.
   */
  protected readonly store = inject(IamStore);

  /**
   * Router used to navigate after authentication.
   */
  private readonly router = inject(Router);

  /**
   * Route that exposes the URL requested before the sign-in.
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Reactive form used to capture sign-in credentials.
   */
  protected readonly form = new FormGroup({
    email: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, emailFormatValidator()],
    }),
    password: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  /**
   * Indicates whether the password input should be visually hidden.
   */
  protected hidePassword = true;

  /**
   * Submits the sign-in form.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const command: SignInCommand = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    };

    this.store.signIn(command, this.router, this.route.snapshot.queryParamMap.get('returnUrl'));
  }

  /**
   * Toggles password visibility in the form.
   */
  protected togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Resolves the translation key for e-mail validation errors.
   *
   * @returns Translation key for the current e-mail validation error
   */
  protected getEmailErrorKey(): string {
    const control = this.form.controls.email;

    if (control.hasError('required')) return 'iam.errors.email-required';
    if (control.hasError('emailFormat')) return 'iam.errors.email-format';

    return '';
  }
}
