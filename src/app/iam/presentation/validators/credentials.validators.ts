import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { CredentialsPolicy } from '../../domain/model/credentials-policy';

/**
 * Validator that requires a valid e-mail address containing an at sign.
 *
 * @returns Validator function reporting the `emailFormat` error
 */
export function emailFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!value) return null;
    return CredentialsPolicy.isValidEmail(value) ? null : { emailFormat: true };
  };
}

/**
 * Validator that requires one uppercase letter, one number and more than eight characters.
 *
 * @returns Validator function reporting the `passwordStrength` error with the violated rules
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = String(control.value ?? '');
    if (!value) return null;
    const violations = CredentialsPolicy.passwordViolations(value);
    return violations.length ? { passwordStrength: violations } : null;
  };
}

/**
 * Validator that requires two controls of a group to have the same value.
 *
 * @param controlName - Name of the control holding the reference value
 * @param confirmName - Name of the control that must match it
 * @returns Validator function reporting the `mismatch` error on the group
 */
export function matchingValidator(controlName: string, confirmName: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const first = group.get(controlName)?.value;
    const second = group.get(confirmName)?.value;
    return first === second ? null : { mismatch: true };
  };
}
