/**
 * Request payload for creating an IoT telemetry device.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateTelemetryDeviceRequest {
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
}
