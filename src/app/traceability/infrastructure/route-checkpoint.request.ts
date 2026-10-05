/**
 * Request payload for creating a route checkpoint.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateRouteCheckpointRequest {
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
