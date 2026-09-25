/**
 * Request payload for creating a batch of beverage products.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateProductBatchRequest {
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
}
