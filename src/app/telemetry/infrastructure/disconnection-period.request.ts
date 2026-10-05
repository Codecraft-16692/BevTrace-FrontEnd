/**
 * Request payload for creating a device disconnection period.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateDisconnectionPeriodRequest {
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
}
