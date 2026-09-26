import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a physical inventory reconciliation for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface InventoryReconciliationResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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

/**
 * Response envelope for a physical inventory reconciliation collection queries.
 */
export interface InventoryReconciliationsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  reconciliations: InventoryReconciliationResource[];
}
