import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { IncidentRecord } from '../domain/model/incident-record.entity';
import { IncidentRecordResource, IncidentRecordsResponse } from './incident-record-response';
import { IncidentRecordAssembler } from './incident-record-assembler';

const incidentRecordEndpointUrl = `${environment.serverBasePath}${environment.incidentRecordsEndpointPath}`;

/**
 * HTTP endpoint client for an incident record.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class IncidentRecordApiEndpoint extends BaseApiEndpoint<
  IncidentRecord,
  IncidentRecordResource,
  IncidentRecordsResponse,
  IncidentRecordAssembler
> {
  /**
   * Creates a new IncidentRecordApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, incidentRecordEndpointUrl, new IncidentRecordAssembler());
    this.expansions = ['log'];
  }

  /**
   * Runs the anomaly detection on the backend (POST /incidents/detections).
   *
   * @returns Observable emitting how many incidents were created and reopened
   */
  detect(): Observable<{ created: number; reopened: number }> {
    return this.http
      .post<{ created: number; reopened: number }>(`${this.endpointUrl}/detections`, {})
      .pipe(catchError(this.handleError('Failed to detect anomalies')));
  }
}
