import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an incident record for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface IncidentRecordResource extends BaseResource {
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
   * Embedded log returned by the `_expand` query.
   */
  log?: { destinationName: string; vehiclePlate: string };
}

/**
 * Response envelope for an incident record collection queries.
 */
export interface IncidentRecordsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  incidents: IncidentRecordResource[];
}
