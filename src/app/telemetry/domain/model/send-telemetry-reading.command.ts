/**
 * Command for ingesting a telemetry reading.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface SendTelemetryReadingCommand {
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
   * The reported temperature in degrees Celsius.
   */
  temperature: number;
}
