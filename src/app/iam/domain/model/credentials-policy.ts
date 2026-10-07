/**
 * Minimum number of characters required for a password ("more than 8").
 */
export const PASSWORD_MIN_LENGTH = 9;

/**
 * Pattern that requires a local part, an at sign and a domain with extension.
 */
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Rules that a password can violate.
 */
export type PasswordViolation = 'min-length' | 'uppercase' | 'number';

/**
 * Domain policy describing the credential rules of BevTrace.
 *
 * @remarks
 * The e-mail must contain an at sign followed by a valid domain and the
 * password must have at least one uppercase letter, one number and more than
 * eight characters. The policy is pure so it can be reused by form validators
 * and by unit tests.
 */
export class CredentialsPolicy {
  /**
   * Checks whether an e-mail address has a valid structure.
   *
   * @param email - E-mail address to validate
   * @returns True when the e-mail contains an at sign and a valid domain
   */
  static isValidEmail(email: string): boolean {
    return EMAIL_PATTERN.test(email.trim());
  }

  /**
   * Lists the rules violated by a password.
   *
   * @param password - Password to evaluate
   * @returns Array with the violated rules, empty when the password is valid
   */
  static passwordViolations(password: string): PasswordViolation[] {
    const violations: PasswordViolation[] = [];
    if (password.length < PASSWORD_MIN_LENGTH) violations.push('min-length');
    if (!/[A-Z]/.test(password)) violations.push('uppercase');
    if (!/[0-9]/.test(password)) violations.push('number');
    return violations;
  }
}
