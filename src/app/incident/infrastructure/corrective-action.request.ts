/**
 * Request payload for creating a corrective action.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateCorrectiveActionRequest {
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
}
