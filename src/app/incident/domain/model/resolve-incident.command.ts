/**
 * Command for resolving an incident.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface ResolveIncidentCommand {
  /**
   * The identifier of the incident.
   */
  incidentId: number;
}
