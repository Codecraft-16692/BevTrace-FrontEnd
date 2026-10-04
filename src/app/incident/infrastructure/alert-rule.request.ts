/**
 * Request payload for creating an alert rule.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateAlertRuleRequest {
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
