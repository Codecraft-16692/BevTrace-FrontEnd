import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an incident record within the incident domain.
 *
 * @remarks
 * In Domain-Driven Design, IncidentRecord is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the incident bounded context.
 */
export class IncidentRecord implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the traceability log where the anomaly occurred.
   */
  logId: number;

  /**
   * The identifier of the rule that raised the incident.
   */
  ruleId: number;

  /**
   * The type of anomaly detected.
   */
  anomalyType: 'TEMPERATURE_MAX' | 'DELAY_MINUTES' | 'SIGNAL_LOSS_MINUTES';

  /**
   * The incident severity.
   */
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

  /**
   * The incident status.
   */
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';

  /**
   * The ISO 8601 timestamp of detection.
   */
  detectedAt: string;

  /**
   * The incident description.
   */
  description: string;

  /**
   * The identifier of the user who acknowledged the incident.
   */
  acknowledgedBy: number | null;

  /**
   * The ISO 8601 timestamp of the acknowledgement.
   */
  acknowledgedAt: string | null;

  /**
   * The ISO 8601 timestamp of the resolution.
   */
  resolvedAt: string | null;

  /**
   * The number of times the incident was reopened.
   */
  reopenCount: number;

  /**
   * The destination of the affected dispatch.
   */
  destinationName: string;

  /**
   * The plate of the affected vehicle.
   */
  vehiclePlate: string;

  /**
   * Creates a new IncidentRecord entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    logId: number;
    ruleId: number;
    anomalyType: 'TEMPERATURE_MAX' | 'DELAY_MINUTES' | 'SIGNAL_LOSS_MINUTES';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED';
    detectedAt: string;
    description: string;
    acknowledgedBy: number | null;
    acknowledgedAt: string | null;
    resolvedAt: string | null;
    reopenCount: number;
    destinationName: string;
    vehiclePlate: string;
  }) {
    this.id = params.id;
    this.logId = params.logId;
    this.ruleId = params.ruleId;
    this.anomalyType = params.anomalyType;
    this.severity = params.severity;
    this.status = params.status;
    this.detectedAt = params.detectedAt;
    this.description = params.description;
    this.acknowledgedBy = params.acknowledgedBy;
    this.acknowledgedAt = params.acknowledgedAt;
    this.resolvedAt = params.resolvedAt;
    this.reopenCount = params.reopenCount;
    this.destinationName = params.destinationName;
    this.vehiclePlate = params.vehiclePlate;
  }
}
