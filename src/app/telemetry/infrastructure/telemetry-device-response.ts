import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an IoT telemetry device for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface TelemetryDeviceResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the vehicle carrying the device.
   */
  vehicleId: number;

  /**
   * The identifier of the device model.
   */
  modelId: number;

  /**
   * The unique hardware code of the device.
   */
  deviceCode: string;

  /**
   * The ISO 8601 installation timestamp.
   */
  installedAt: string;

  /**
   * Indicates whether the device is provisioned and active.
   */
  isActive: boolean;

  /**
   * The current connectivity status.
   */
  connectionStatus: 'CONNECTED' | 'DISCONNECTED';

  /**
   * The ISO 8601 timestamp of the last received signal.
   */
  lastSignalAt: string;

  /**
   * Embedded vehicle returned by the `_expand` query.
   */
  vehicle?: { plateNumber: string };

  /**
   * Embedded model returned by the `_expand` query.
   */
  model?: { name: string };
}

/**
 * Response envelope for an IoT telemetry device collection queries.
 */
export interface TelemetryDevicesResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  devices: TelemetryDeviceResource[];
}
