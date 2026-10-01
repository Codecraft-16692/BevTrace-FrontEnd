/**
 * Request payload for creating an incident record.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateIncidentRecordRequest {
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
}
