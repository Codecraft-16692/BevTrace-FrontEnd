import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { AlertRule } from '../domain/model/alert-rule.entity';
import { AlertRuleResource, AlertRulesResponse } from './alert-rule-response';
import { AlertRuleAssembler } from './alert-rule-assembler';

const alertRuleEndpointUrl = `${environment.serverBasePath}${environment.incidentRulesEndpointPath}`;

/**
 * HTTP endpoint client for an alert rule.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class AlertRuleApiEndpoint extends BaseApiEndpoint<
  AlertRule,
  AlertRuleResource,
  AlertRulesResponse,
  AlertRuleAssembler
> {
  /**
   * Creates a new AlertRuleApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, alertRuleEndpointUrl, new AlertRuleAssembler());
  }
}
