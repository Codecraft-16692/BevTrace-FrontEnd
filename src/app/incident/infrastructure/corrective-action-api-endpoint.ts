import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { CorrectiveAction } from '../domain/model/corrective-action.entity';
import { CorrectiveActionResource, CorrectiveActionsResponse } from './corrective-action-response';
import { CorrectiveActionAssembler } from './corrective-action-assembler';

const correctiveActionEndpointUrl = `${environment.serverBasePath}${environment.incidentActionsEndpointPath}`;

/**
 * HTTP endpoint client for a corrective action.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class CorrectiveActionApiEndpoint extends BaseApiEndpoint<
  CorrectiveAction,
  CorrectiveActionResource,
  CorrectiveActionsResponse,
  CorrectiveActionAssembler
> {
  /**
   * Creates a new CorrectiveActionApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, correctiveActionEndpointUrl, new CorrectiveActionAssembler());
    this.expansions = ['user'];
  }
}
