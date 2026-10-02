import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a corrective action for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface CorrectiveActionResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the incident.
   */
  incidentId: number;

  /**
   * The identifier of the user who applied the action.
   */
  userId: number;

  /**
   * The description of the action.
   */
  description: string;

  /**
   * The ISO 8601 timestamp of the action.
   */
  appliedAt: string;

  /**
   * Embedded user returned by the `_expand` query.
   */
  user?: { name: string };
}

/**
 * Response envelope for a corrective action collection queries.
 */
export interface CorrectiveActionsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  actions: CorrectiveActionResource[];
}
