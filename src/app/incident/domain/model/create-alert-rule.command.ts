/**
 * Command for creating an alert rule.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface CreateAlertRuleCommand {
  /**
   * The evaluated condition.
   */
  conditionType: 'TEMPERATURE_MAX' | 'DELAY_MINUTES' | 'SIGNAL_LOSS_MINUTES';

  /**
   * The tolerance threshold.
   */
  threshold: number;

  /**
   * The severity of the raised incidents.
   */
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /**
   * The description of the rule.
   */
  description: string;
}
