/**
 * Command for acknowledging an incident.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface AcknowledgeIncidentCommand {
  /**
   * The identifier of the incident.
   */
  incidentId: number;

  /**
   * The identifier of the acknowledging user.
   */
  userId: number;
}
