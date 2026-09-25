/**
 * Request payload for creating an inventory discrepancy.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateInventoryDiscrepancyRequest {
  /**
   * The identifier of the reconciliation that detected the discrepancy.
   */
  reconciliationId: number;

  /**
   * The identifier of the batch with the discrepancy.
   */
  batchId: number;

  /**
   * The quantity registered in the system.
   */
  expectedQty: number;

  /**
   * The quantity counted physically.
   */
  countedQty: number;

  /**
   * The discrepancy status.
   */
  status: 'OPEN' | 'RESOLVED';

  /**
   * The ISO 8601 timestamp of detection.
   */
  detectedAt: string;

  /**
   * The ISO 8601 timestamp of resolution.
   */
  resolvedAt: string | null;

  /**
   * The note registered when the discrepancy was resolved.
   */
  resolutionNote: string | null;
}
