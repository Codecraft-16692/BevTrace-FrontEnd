import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a batch of beverage products for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface ProductBatchResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the product contained in the batch.
   */
  productId: number;

  /**
   * The identifier of the warehouse zone where the batch is stored.
   */
  zoneId: number;

  /**
   * The batch code printed on the pallet label and used for scanning.
   */
  batchNumber: string;

  /**
   * The quantity of units announced for the batch.
   */
  initialQty: number;

  /**
   * The quantity of units currently available.
   */
  currentQty: number;

  /**
   * The lifecycle status of the batch.
   */
  status: 'EXPECTED' | 'AVAILABLE' | 'DEPLETED';

  /**
   * The ISO 8601 timestamp when the batch entered the warehouse.
   */
  receivedAt: string | null;

  /**
   * The expiration date in ISO date format.
   */
  expirationDate: string;

  /**
   * Embedded product returned by the `_expand` query.
   */
  product?: { name: string; skuCode: string };

  /**
   * Embedded zone returned by the `_expand` query.
   */
  zone?: { name: string };
}

/**
 * Response envelope for a batch of beverage products collection queries.
 */
export interface ProductBatchesResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  batches: ProductBatchResource[];
}
