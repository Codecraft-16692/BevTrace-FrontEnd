import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { DisconnectionPeriod } from '../domain/model/disconnection-period.entity';
import { DisconnectionPeriodResource, DisconnectionPeriodsResponse } from './disconnection-period-response';
import { DisconnectionPeriodAssembler } from './disconnection-period-assembler';

const disconnectionPeriodEndpointUrl = `${environment.serverBasePath}${environment.telemetryDisconnectionsEndpointPath}`;

/**
 * HTTP endpoint client for a device disconnection period.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class DisconnectionPeriodApiEndpoint extends BaseApiEndpoint<
  DisconnectionPeriod,
  DisconnectionPeriodResource,
  DisconnectionPeriodsResponse,
  DisconnectionPeriodAssembler
> {
  /**
   * Creates a new DisconnectionPeriodApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, disconnectionPeriodEndpointUrl, new DisconnectionPeriodAssembler());
    this.expansions = ['device'];
  }
}
