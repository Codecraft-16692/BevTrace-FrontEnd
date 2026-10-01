import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a route checkpoint for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface RouteCheckpointResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the traceability log.
   */
  logId: number;

  /**
   * The position of the checkpoint in the route.
   */
  sequence: number;

  /**
   * The checkpoint location name.
   */
  locationName: string;

  /**
   * The checkpoint latitude.
   */
  latitude: number;

  /**
   * The checkpoint longitude.
   */
  longitude: number;

  /**
   * The checkpoint status.
   */
  status: 'PENDING' | 'REACHED' | 'OMITTED';

  /**
   * The ISO 8601 timestamp when the checkpoint was reached.
   */
  reachedAt: string | null;

  /**
   * The observation registered for omitted checkpoints.
   */
  observation: string | null;
}

/**
 * Response envelope for a route checkpoint collection queries.
 */
export interface RouteCheckpointsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  checkpoints: RouteCheckpointResource[];
}
