import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a subscription payment within the subscription domain.
 *
 * @remarks
 * In Domain-Driven Design, Payment is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the subscription bounded context.
 */
export class Payment implements BaseEntity {
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

  /**
   * Creates a new Payment entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    subscriptionId: number;
    amount: number;
    currency: string;
    status: 'PAID' | 'FAILED';
    cardLast4: string;
    paidAt: string;
  }) {
    this.id = params.id;
    this.subscriptionId = params.subscriptionId;
    this.amount = params.amount;
    this.currency = params.currency;
    this.status = params.status;
    this.cardLast4 = params.cardLast4;
    this.paidAt = params.paidAt;
  }
}
