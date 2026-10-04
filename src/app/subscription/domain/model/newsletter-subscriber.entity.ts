import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a newsletter subscriber within the subscription domain.
 *
 * @remarks
 * In Domain-Driven Design, NewsletterSubscriber is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the subscription bounded context.
 */
export class NewsletterSubscriber implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The subscribed e-mail address.
   */
  email: string;

  /**
   * The ISO 8601 timestamp of the subscription.
   */
  subscribedAt: string;

  /**
   * Creates a new NewsletterSubscriber entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    email: string;
    subscribedAt: string;
  }) {
    this.id = params.id;
    this.email = params.email;
    this.subscribedAt = params.subscribedAt;
  }
}
