import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a commercial contact request within the subscription domain.
 *
 * @remarks
 * In Domain-Driven Design, ContactRequest is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the subscription bounded context.
 */
export class ContactRequest implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The full name of the visitor.
   */
  fullName: string;

  /**
   * The contact e-mail.
   */
  email: string;

  /**
   * The company of the visitor.
   */
  company: string;

  /**
   * The message sent.
   */
  message: string;

  /**
   * The ISO 8601 timestamp of the request.
   */
  createdAt: string;

  /**
   * Creates a new ContactRequest entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    fullName: string;
    email: string;
    company: string;
    message: string;
    createdAt: string;
  }) {
    this.id = params.id;
    this.fullName = params.fullName;
    this.email = params.email;
    this.company = params.company;
    this.message = params.message;
    this.createdAt = params.createdAt;
  }
}
