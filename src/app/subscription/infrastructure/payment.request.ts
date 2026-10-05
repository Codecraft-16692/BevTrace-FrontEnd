/**
 * Request payload for creating a subscription payment.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreatePaymentRequest {
  /**
   * The identifier of the subscription.
   */
  subscriptionId: number;

  /**
   * The charged amount.
   */
  amount: number;

  /**
   * The ISO currency code.
   */
  currency: string;

  /**
   * The payment result.
   */
  status: 'PAID' | 'FAILED';

  /**
   * The last four digits of the card. The full number is never stored.
   */
  cardLast4: string;

  /**
   * The ISO 8601 timestamp of the payment.
   */
  paidAt: string;
}
