import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { TraceabilityLog } from '../domain/model/traceability-log.entity';
import { TraceabilityLogResource, TraceabilityLogsResponse } from './traceability-log-response';
import { TraceabilityLogAssembler } from './traceability-log-assembler';

const traceabilityLogEndpointUrl = `${environment.serverBasePath}${environment.traceabilityLogsEndpointPath}`;

/**
 * HTTP endpoint client for a route traceability log.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class TraceabilityLogApiEndpoint extends BaseApiEndpoint<
  TraceabilityLog,
  TraceabilityLogResource,
  TraceabilityLogsResponse,
  TraceabilityLogAssembler
> {
  /**
   * Creates a new TraceabilityLogApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, traceabilityLogEndpointUrl, new TraceabilityLogAssembler());
  }
}
