import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a product waste (shrinkage) record for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface WasteRecordResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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

  /**
   * Embedded batch returned by the `_expand` query.
   */
  batch?: { batchNumber: string };

  /**
   * Embedded user returned by the `_expand` query.
   */
  user?: { name: string };
}

/**
 * Response envelope for a product waste (shrinkage) record collection queries.
 */
export interface WasteRecordsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  wasteRecords: WasteRecordResource[];
}
