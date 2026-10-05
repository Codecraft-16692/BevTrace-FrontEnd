/**
 * Request payload for creating a telemetry reading.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateLocationStreamRequest {
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
}
