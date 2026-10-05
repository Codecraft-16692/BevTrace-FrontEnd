import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a device disconnection period for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface DisconnectionPeriodResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the device.
   */
  deviceId: number;

  /**
   * The ISO 8601 timestamp when the signal was lost.
   */
  startedAt: string;

  /**
   * The ISO 8601 timestamp when the signal was restored.
   */
  endedAt: string | null;

  /**
   * Indicates whether telemetry for the period is available.
   */
  dataStatus: 'AVAILABLE' | 'UNAVAILABLE';

  /**
   * Embedded device returned by the `_expand` query.
   */
  device?: { deviceCode: string };
}

/**
 * Response envelope for a device disconnection period collection queries.
 */
export interface DisconnectionPeriodsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  periods: DisconnectionPeriodResource[];
}
