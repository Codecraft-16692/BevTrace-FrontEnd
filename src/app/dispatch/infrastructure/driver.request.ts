/**
 * Request payload for creating a vehicle driver.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateDriverRequest {
  /**
   * The full name of the driver.
   */
  fullName: string;

  /**
   * The driving license number.
   */
  licenseNumber: string;

  /**
   * The driver availability status.
   */
  status: 'ACTIVE' | 'ON_LEAVE';
}
