/**
 * Request payload to register a batch (POST /batches).
 *
 * @remarks
 * The backend sets the status (EXPECTED), the stock and the audit fields.
 */
export interface RegisterBatchRequest {
  productId: number;

  zoneId: number;

  batchNumber: string;

  initialQty: number;

  expirationDate: string;
}
