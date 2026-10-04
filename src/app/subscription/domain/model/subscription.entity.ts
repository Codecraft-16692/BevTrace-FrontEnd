import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a company subscription within the subscription domain.
 *
 * @remarks
 * In Domain-Driven Design, Subscription is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the subscription bounded context.
 */
export class Subscription implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the subscribing user.
   */
  userId: number;

  /**
   * The name of the subscribing company.
   */
  companyName: string;

  /**
   * The code of the subscribed plan.
   */
  planCode: string;

  /**
   * The billing cycle.
   */
  billingCycle: 'MONTHLY' | 'YEARLY';

  /**
   * The subscription status.
   */
  status: 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';

  /**
   * The ISO 8601 start of the current period.
   */
  currentPeriodStart: string;

  /**
   * The ISO 8601 end of the current period.
   */
  currentPeriodEnd: string;

  /**
   * The ISO 8601 cancellation timestamp.
   */
  cancelledAt: string | null;

  /**
   * The name of the subscribing user.
   */
  userName: string;

  /**
   * The e-mail of the subscribing user.
   */
  userEmail: string;

  /**
   * Creates a new Subscription entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    userId: number;
    companyName: string;
    planCode: string;
    billingCycle: 'MONTHLY' | 'YEARLY';
    status: 'PENDING' | 'ACTIVE' | 'PAST_DUE' | 'CANCELLED';
    currentPeriodStart: string;
    currentPeriodEnd: string;
    cancelledAt: string | null;
    userName: string;
    userEmail: string;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.companyName = params.companyName;
    this.planCode = params.planCode;
    this.billingCycle = params.billingCycle;
    this.status = params.status;
    this.currentPeriodStart = params.currentPeriodStart;
    this.currentPeriodEnd = params.currentPeriodEnd;
    this.cancelledAt = params.cancelledAt;
    this.userName = params.userName;
    this.userEmail = params.userEmail;
  }
}
