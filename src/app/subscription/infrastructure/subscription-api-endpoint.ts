import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionResource, SubscriptionsResponse } from './subscription-response';
import { SubscriptionAssembler } from './subscription-assembler';

const subscriptionEndpointUrl = `${environment.serverBasePath}${environment.subscriptionsEndpointPath}`;

/**
 * HTTP endpoint client for a company subscription.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class SubscriptionApiEndpoint extends BaseApiEndpoint<
  Subscription,
  SubscriptionResource,
  SubscriptionsResponse,
  SubscriptionAssembler
> {
  /**
   * Creates a new SubscriptionApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, subscriptionEndpointUrl, new SubscriptionAssembler());
    this.expansions = ['user'];
  }
}
