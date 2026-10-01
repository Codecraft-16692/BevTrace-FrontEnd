import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Notification } from '../domain/model/notification.entity';
import { NotificationResource, NotificationsResponse } from './notification-response';

/**
 * Assembler for converting between Notification domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class NotificationAssembler implements BaseAssembler<
  Notification,
  NotificationResource,
  NotificationsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of Notification domain entities
   */
  toEntitiesFromResponse(response: NotificationsResponse): Notification[] {
    return response.notifications.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns Notification domain entity
   */
  toEntityFromResource(resource: NotificationResource): Notification {
    return new Notification({
      id: resource.id,
      recipientRole: resource.recipientRole,
      type: resource.type,
      title: resource.title,
      message: resource.message,
      createdAt: resource.createdAt,
      read: resource.read,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - Notification domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: Notification): NotificationResource {
    return {
      id: entity.id,
      recipientRole: entity.recipientRole,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      createdAt: entity.createdAt,
      read: entity.read,
    };
  }
}
