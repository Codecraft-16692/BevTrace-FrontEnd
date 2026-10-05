/**
 * Request payload for creating an in-app notification.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateNotificationRequest {
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
