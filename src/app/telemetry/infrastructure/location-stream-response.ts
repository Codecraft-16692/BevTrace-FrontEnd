import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a telemetry reading for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the REST
 * resource contract exposed by the BevTrace Web Services.
 */
export interface LocationStreamResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the emitting device.
   */
  deviceId: number;

  /**
   * The reported latitude.
   */
  latitude: number;

  /**
   * The reported longitude.
   */
  longitude: number;

  /**
   * The reported speed in km/h.
   */
  speed: number;

  /**
   * The reported cargo temperature in degrees Celsius.
   */
  temperature: number;

  /**
   * The ISO 8601 timestamp of the reading.
   */
  timestamp: string;

  /**
   * Embedded device returned by the `_expand` query.
   */
  device?: { deviceCode: string };
}

/**
 * Response envelope for a telemetry reading collection queries.
 */
export interface LocationStreamsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  streams: LocationStreamResource[];
}
