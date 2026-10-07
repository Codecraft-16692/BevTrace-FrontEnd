import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SignUpCommand } from '../../../domain/model/sign-up.command';
import { CredentialsPolicy, PasswordViolation } from '../../../domain/model/credentials-policy';
import { IamStore } from '../../../application/iam.store';
import {
  emailFormatValidator,
  matchingValidator,
  passwordStrengthValidator,
} from '../../validators/credentials.validators';
import { Toolbar } from '../../../../shared/presentation/components/toolbar/toolbar';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component responsible for rendering and processing the sign-up form.
 *
 * @remarks
 * This standalone component belongs to the IAM presentation layer. It enforces
 * the credential policy (valid e-mail, one uppercase letter, one number and
 * more than eight characters), builds a SignUpCommand and delegates the
 * registration to IamStore. Administrator accounts cannot be self-registered.
 */
@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe,
    MatProgressSpinnerModule,
    Toolbar,
    MessageBanner,
  ],
  templateUrl: './sign-up-form.html',
  styleUrl: './sign-up-form.css',
})
export class SignUpForm {
  /**
   * Store responsible for authentication state and operations.
   */
  protected readonly store = inject(IamStore);

  /**
   * Router used to navigate after registration.
   */
  private readonly router = inject(Router);

  /**
   * Roles that can be chosen during self-registration.
   */
  protected readonly roleOptions = [
    { id: 2, label: 'roles.ROLE_LOGISTICS_MANAGER' },
    { id: 3, label: 'roles.ROLE_WAREHOUSE_OPERATOR' },
  ];

  /**
   * Password rules displayed as a checklist.
   */
  protected readonly passwordRules: PasswordViolation[] = ['min-length', 'uppercase', 'number'];

  /**
   * Reactive form used to capture registration data.
   */
  protected readonly form = new FormGroup(
    {
      name: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(3)],
      }),
      email: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, emailFormatValidator()],
      }),
      phone: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.pattern(/^[+0-9 ()-]{7,20}$/)],
      }),
      roleId: new FormControl<number>(2, { nonNullable: true, validators: [Validators.required] }),
      password: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, passwordStrengthValidator()],
      }),
      confirmPassword: new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [matchingValidator('password', 'confirmPassword')] },
  );

  /**
   * Indicates whether the password input should be visually hidden.
   */
  protected hidePassword = true;

  /**
   * Submits the sign-up form.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();

    const command: SignUpCommand = {
      name: value.name,
      email: value.email,
      phone: value.phone,
      password: value.password,
      roleId: value.roleId,
    };

    this.store.signUp(command, this.router);
  }

  /**
   * Toggles password visibility in the form.
   */
  protected togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  /**
   * Determines whether the current password satisfies a rule.
   *
   * @param rule - Password rule to evaluate
   * @returns True when the rule is satisfied by the typed password
   */
  protected isRuleMet(rule: PasswordViolation): boolean {
    const password = this.form.controls.password.value;
    return password.length > 0 && !CredentialsPolicy.passwordViolations(password).includes(rule);
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
