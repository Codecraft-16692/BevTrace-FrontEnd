import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a subscription plan within the subscription domain.
 *
 * @remarks
 * In Domain-Driven Design, SubscriptionPlan is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the subscription bounded context.
 */
export class SubscriptionPlan implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The plan code.
   */
  code: string;

  /**
   * The plan name.
   */
  name: string;

  /**
   * The translation key of the plan description.
   */
  descriptionKey: string;

  /**
   * The price amount for the billing period.
   */
  priceAmount: number;

  /**
   * The ISO currency code.
   */
  currency: string;

  /**
   * The billing period.
   */
  billingPeriod: 'MONTHLY' | 'YEARLY';

  /**
   * The maximum number of active routes.
   */
  maxRoutes: number;

  /**
   * The maximum number of IoT node connections.
   */
  maxDevices: number;

  /**
   * The maximum number of users.
   */
  maxUsers: number;

  /**
   * The translation keys of the included features.
   */
  featureKeys: string[];

  /**
   * Indicates whether the plan is promoted as most popular.
   */
  highlighted: boolean;

  /**
   * Indicates whether the plan requires contacting sales.
   */
  custom: boolean;

  /**
   * Indicates whether the plan can be purchased.
   */
  active: boolean;

  /**
   * Creates a new SubscriptionPlan entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    code: string;
    name: string;
    descriptionKey: string;
    priceAmount: number;
    currency: string;
    billingPeriod: 'MONTHLY' | 'YEARLY';
    maxRoutes: number;
    maxDevices: number;
    maxUsers: number;
    featureKeys: string[];
    highlighted: boolean;
    custom: boolean;
    active: boolean;
  }) {
    this.id = params.id;
    this.code = params.code;
    this.name = params.name;
    this.descriptionKey = params.descriptionKey;
    this.priceAmount = params.priceAmount;
    this.currency = params.currency;
    this.billingPeriod = params.billingPeriod;
    this.maxRoutes = params.maxRoutes;
    this.maxDevices = params.maxDevices;
    this.maxUsers = params.maxUsers;
    this.featureKeys = params.featureKeys;
    this.highlighted = params.highlighted;
    this.custom = params.custom;
    this.active = params.active;
  }
}
