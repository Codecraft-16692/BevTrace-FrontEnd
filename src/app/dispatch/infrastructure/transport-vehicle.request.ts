/**
 * Request payload for creating a transport vehicle.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateTransportVehicleRequest {
  /**
   * The identifier of the assigned driver.
   */
  driverId: number;

  /**
   * The vehicle plate number.
   */
  plateNumber: string;

  /**
   * The maximum load capacity in kilograms.
   */
  maxCapacity: number;

  /**
   * Indicates whether the vehicle can be assigned to a dispatch.
   */
  isAvailable: boolean;
}
