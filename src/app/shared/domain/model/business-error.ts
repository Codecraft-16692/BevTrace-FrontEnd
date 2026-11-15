import { AppMessage } from './app-message';

/**
 * Error raised when a business rule described in the user stories is violated.
 *
 * @remarks
 * The application stores validate these rules on the client and raise this
 * error before calling the Web Services, which enforce the same rules. The translation key and its
 * parameters are shown to the user by the presentation layer.
 *
 * @example
 * ```typescript
 * throw new BusinessError('dispatch.errors.vehicle-unavailable', { plate: 'BTV-101' });
 * ```
 */
export class BusinessError extends Error {
  /**
   * The user-facing message describing the violated rule.
   */
  readonly appMessage: AppMessage;

  /**
   * Creates a new BusinessError.
   *
   * @param key - Translation key describing the violated rule
   * @param params - Interpolation parameters used by the translation
   */
  constructor(key: string, params?: Record<string, string | number>) {
    super(key);
    this.name = 'BusinessError';
    this.appMessage = { key, params };
  }
}
