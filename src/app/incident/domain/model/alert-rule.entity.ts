import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an alert rule within the incident domain.
 *
 * @remarks
 * In Domain-Driven Design, AlertRule is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the incident bounded context.
 */
export class AlertRule implements BaseEntity {
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

  /**
   * Creates a new AlertRule entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    conditionType: 'TEMPERATURE_MAX' | 'DELAY_MINUTES' | 'SIGNAL_LOSS_MINUTES';
    threshold: number;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    active: boolean;
  }) {
    this.id = params.id;
    this.conditionType = params.conditionType;
    this.threshold = params.threshold;
    this.severity = params.severity;
    this.description = params.description;
    this.active = params.active;
  }
}
