import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an alert rule for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface AlertRuleResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The condition evaluated by the rule.
   */
  conditionType: 'TEMPERATURE_MAX' | 'DELAY_MINUTES' | 'SIGNAL_LOSS_MINUTES';

  /**
   * The tolerance threshold of the condition.
   */
  threshold: number;

  /**
   * The severity assigned to incidents raised by the rule.
   */
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /**
   * The description of the rule.
   */
  description: string;

  /**
   * Indicates whether the rule is evaluated.
   */
  active: boolean;
}

/**
 * Response envelope for an alert rule collection queries.
 */
export interface AlertRulesResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  rules: AlertRuleResource[];
}
