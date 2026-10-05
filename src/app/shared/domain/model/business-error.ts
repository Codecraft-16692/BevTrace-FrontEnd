import { AppMessage } from './app-message';

/**
 * Error raised when a business rule described in the user stories is violated.
 *
 * @remarks
 * Because the mock REST API cannot enforce domain rules, the application
 * stores validate them and raise this error. The translation key and its
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
