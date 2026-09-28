/**
 * Request payload for creating a cargo assignment.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateCargoAssignmentRequest {
  /**
   * The identifier of the dispatch order.
   */
  dispatchOrderId: number;

  /**
   * The identifier of the batch supplying the cargo.
   */
  batchId: number;

  /**
   * The number of units assigned.
   */
  quantity: number;

  /**
   * The total weight in kilograms.
   */
  totalWeight: number;

  /**
   * The number of pallets loaded.
   */
  palletCount: number;
}
