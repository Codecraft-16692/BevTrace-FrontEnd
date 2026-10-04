import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Notification } from '../domain/model/notification.entity';
import { NotificationResource, NotificationsResponse } from './notification-response';
import { NotificationAssembler } from './notification-assembler';

const notificationEndpointUrl = `${environment.serverBasePath}${environment.incidentNotificationsEndpointPath}`;

/**
 * HTTP endpoint client for an in-app notification.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class NotificationApiEndpoint extends BaseApiEndpoint<
  Notification,
  NotificationResource,
  NotificationsResponse,
  NotificationAssembler
> {
  /**
   * Creates a new NotificationApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, notificationEndpointUrl, new NotificationAssembler());
  }
}
