import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a vehicle driver for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface DriverResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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

/**
 * Response envelope for a vehicle driver collection queries.
 */
export interface DriversResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  drivers: DriverResource[];
}
