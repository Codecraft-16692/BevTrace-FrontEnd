import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a physical warehouse zone for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the REST
 * resource contract exposed by the BevTrace Web Services.
 */
export interface WarehouseZoneResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The zone name.
   */
  name: string;

  /**
   * The aisle code.
   */
  aisle: string;

  /**
   * The rack code.
   */
  rack: string;
}

/**
 * Response envelope for a physical warehouse zone collection queries.
 */
export interface WarehouseZonesResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  zones: WarehouseZoneResource[];
}
