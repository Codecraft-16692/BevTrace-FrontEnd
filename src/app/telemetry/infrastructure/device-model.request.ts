/**
 * Request payload for creating an IoT device model.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateDeviceModelRequest {
  /**
   * The model name.
   */
  name: string;

  /**
   * The manufacturer name.
   */
  manufacturer: string;

  /**
   * The sensors supported by the model.
   */
  sensors: string;
}
