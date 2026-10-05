import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a transport vehicle for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface TransportVehicleResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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

  /**
   * Embedded driver returned by the `_expand` query.
   */
  driver?: { fullName: string };
}

/**
 * Response envelope for a transport vehicle collection queries.
 */
export interface TransportVehiclesResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  vehicles: TransportVehicleResource[];
}
