/**
 * User-facing message produced by an application store.
 *
 * @remarks
 * The message carries a translation key instead of a literal text so that the
 * presentation layer can render it in the language selected by the user.
 *
 * @example
 * ```typescript
 * const message: AppMessage = {
 *   key: 'inventory.errors.stock-insufficient',
 *   params: { batch: 'LT-2609-001' }
 * };
 * ```
 */
export interface AppMessage {
  /**
   * The translation key of the message.
   */
  key: string;

  /**
   * Interpolation parameters used by the translation.
   */
  params?: Record<string, string | number>;
}
