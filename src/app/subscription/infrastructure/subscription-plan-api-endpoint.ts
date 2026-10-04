import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { SubscriptionPlanResource, SubscriptionPlansResponse } from './subscription-plan-response';
import { SubscriptionPlanAssembler } from './subscription-plan-assembler';

const subscriptionPlanEndpointUrl = `${environment.serverBasePath}${environment.subscriptionPlansEndpointPath}`;

/**
 * HTTP endpoint client for a subscription plan.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class SubscriptionPlanApiEndpoint extends BaseApiEndpoint<
  SubscriptionPlan,
  SubscriptionPlanResource,
  SubscriptionPlansResponse,
  SubscriptionPlanAssembler
> {
  /**
   * Creates a new SubscriptionPlanApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, subscriptionPlanEndpointUrl, new SubscriptionPlanAssembler());
  }
}
