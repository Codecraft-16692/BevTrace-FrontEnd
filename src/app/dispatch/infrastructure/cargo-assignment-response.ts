import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a cargo assignment for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface CargoAssignmentResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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

  /**
   * Embedded batch returned by the `_expand` query.
   */
  batch?: { batchNumber: string };
}

/**
 * Response envelope for a cargo assignment collection queries.
 */
export interface CargoAssignmentsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  cargoAssignments: CargoAssignmentResource[];
}
