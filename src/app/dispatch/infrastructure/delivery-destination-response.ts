import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a delivery destination for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface DeliveryDestinationResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The client name.
   */
  clientName: string;

  /**
   * The delivery address.
   */
  address: string;

  /**
   * The destination latitude.
   */
  latitude: number;

  /**
   * The destination longitude.
   */
  longitude: number;

  /**
   * The commercial region of the destination.
   */
  region: string;
}

/**
 * Response envelope for a delivery destination collection queries.
 */
export interface DeliveryDestinationsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  destinations: DeliveryDestinationResource[];
}
