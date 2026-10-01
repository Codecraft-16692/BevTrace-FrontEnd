import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { RouteCheckpoint } from '../domain/model/route-checkpoint.entity';
import { RouteCheckpointResource, RouteCheckpointsResponse } from './route-checkpoint-response';
import { RouteCheckpointAssembler } from './route-checkpoint-assembler';

const routeCheckpointEndpointUrl = `${environment.serverBasePath}${environment.traceabilityCheckpointsEndpointPath}`;

/**
 * HTTP endpoint client for a route checkpoint.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class RouteCheckpointApiEndpoint extends BaseApiEndpoint<
  RouteCheckpoint,
  RouteCheckpointResource,
  RouteCheckpointsResponse,
  RouteCheckpointAssembler
> {
  /**
   * Creates a new RouteCheckpointApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, routeCheckpointEndpointUrl, new RouteCheckpointAssembler());
  }
}
