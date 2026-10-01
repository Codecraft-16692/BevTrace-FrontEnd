import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an in-app notification for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface NotificationResource extends BaseResource {
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
}

/**
 * Response envelope for an in-app notification collection queries.
 */
export interface NotificationsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  notifications: NotificationResource[];
}
