import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a subscription payment for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface PaymentResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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

/**
 * Response envelope for a subscription payment collection queries.
 */
export interface PaymentsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  payments: PaymentResource[];
}
