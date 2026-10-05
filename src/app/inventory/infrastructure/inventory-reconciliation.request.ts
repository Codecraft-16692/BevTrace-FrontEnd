/**
 * Request payload for creating a physical inventory reconciliation.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateInventoryReconciliationRequest {
  /**
   * The reconciliation date in ISO date format.
   */
  date: string;

  /**
   * The reconciliation status.
   */
  status: 'IN_REVIEW' | 'RECONCILED';

  /**
   * The number of batches counted.
   */
  totalBatches: number;

  /**
   * The number of batches whose count matches the system.
   */
  matchedBatches: number;

  /**
   * The Inventory Record Accuracy (ERI) percentage.
   */
  eriPercentage: number;

  /**
   * The identifier of the user who confirmed the reconciliation.
   */
  confirmedBy: number | null;

  /**
   * The ISO 8601 timestamp of the confirmation.
   */
  confirmedAt: string | null;
}
