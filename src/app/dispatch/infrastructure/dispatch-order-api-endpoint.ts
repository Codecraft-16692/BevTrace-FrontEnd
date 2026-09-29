import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { DispatchOrder } from '../domain/model/dispatch-order.entity';
import { DispatchOrderResource, DispatchOrdersResponse } from './dispatch-order-response';
import { DispatchOrderAssembler } from './dispatch-order-assembler';

const dispatchOrderEndpointUrl = `${environment.serverBasePath}${environment.dispatchOrdersEndpointPath}`;

/**
 * HTTP endpoint client for a dispatch order.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class DispatchOrderApiEndpoint extends BaseApiEndpoint<
  DispatchOrder,
  DispatchOrderResource,
  DispatchOrdersResponse,
  DispatchOrderAssembler
> {
  /**
   * Creates a new DispatchOrderApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, dispatchOrderEndpointUrl, new DispatchOrderAssembler());
    this.expansions = ['destination', 'vehicle'];
  }
}
