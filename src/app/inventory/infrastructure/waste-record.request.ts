/**
 * Request payload for creating a product waste (shrinkage) record.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateWasteRecordRequest {
  /**
   * The identifier of the affected batch.
   */
  batchId: number;

  /**
   * The identifier of the user who reported the waste.
   */
  userId: number;

  /**
   * The number of units lost.
   */
  quantity: number;

  /**
   * The reason of the waste.
   */
  reason: string;

  /**
   * The report date in ISO date format.
   */
  reportedDate: string;
}
