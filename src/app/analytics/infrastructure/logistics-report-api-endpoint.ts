import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { LogisticsReport } from '../domain/model/logistics-report.entity';
import { LogisticsReportResource, LogisticsReportsResponse } from './logistics-report-response';
import { LogisticsReportAssembler } from './logistics-report-assembler';

const logisticsReportEndpointUrl = `${environment.serverBasePath}${environment.analyticsReportsEndpointPath}`;

/**
 * HTTP endpoint client for a consolidated logistics report.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class LogisticsReportApiEndpoint extends BaseApiEndpoint<
  LogisticsReport,
  LogisticsReportResource,
  LogisticsReportsResponse,
  LogisticsReportAssembler
> {
  /**
   * Creates a new LogisticsReportApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, logisticsReportEndpointUrl, new LogisticsReportAssembler());
    this.expansions = ['user'];
  }
}
