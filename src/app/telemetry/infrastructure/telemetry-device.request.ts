/**
 * Request payload to provision a device (POST /devices).
 *
 * @remarks
 * Installation date, status and signal data are managed by the backend.
 */
export interface ProvisionDeviceRequest {
  vehicleId: number;

  modelId: number;

  deviceCode: string;
}
