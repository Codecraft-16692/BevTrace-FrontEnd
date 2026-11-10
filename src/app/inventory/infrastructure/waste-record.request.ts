/**
 * Request payload to register a waste record (POST /waste-records).
 *
 * @remarks
 * The user comes from the token and the stock is deducted by the backend.
 */
export interface RegisterWasteRequest {
  batchId: number;

  quantity: number;

  reason: string;
}
