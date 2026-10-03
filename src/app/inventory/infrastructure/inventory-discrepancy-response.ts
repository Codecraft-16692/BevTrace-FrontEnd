import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an inventory discrepancy for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface InventoryDiscrepancyResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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

  /**
   * Embedded batch returned by the `_expand` query.
   */
  batch?: { batchNumber: string };
}

/**
 * Response envelope for an inventory discrepancy collection queries.
 */
export interface InventoryDiscrepanciesResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  discrepancies: InventoryDiscrepancyResource[];
}
