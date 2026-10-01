import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an in-app notification within the incident domain.
 *
 * @remarks
 * In Domain-Driven Design, Notification is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the incident bounded context.
 */
export class Notification implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The role that receives the notification.
   */
  recipientRole: string;

  /**
   * The notification category.
   */
  type: 'INCIDENT' | 'INVENTORY' | 'DISPATCH' | 'TELEMETRY';

  /**
   * The notification title.
   */
  title: string;

  /**
   * The notification message.
   */
  message: string;

  /**
   * The ISO 8601 timestamp of creation.
   */
  createdAt: string;

  /**
   * Indicates whether the notification was read.
   */
  read: boolean;

  /**
   * Creates a new Notification entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    recipientRole: string;
    type: 'INCIDENT' | 'INVENTORY' | 'DISPATCH' | 'TELEMETRY';
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
  }) {
    this.id = params.id;
    this.recipientRole = params.recipientRole;
    this.type = params.type;
    this.title = params.title;
    this.message = params.message;
    this.createdAt = params.createdAt;
    this.read = params.read;
  }
}
