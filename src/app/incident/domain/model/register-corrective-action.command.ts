/**
 * Command for registering a corrective action.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface RegisterCorrectiveActionCommand {
  /**
   * The identifier of the incident.
   */
  incidentId: number;

  /**
   * The identifier of the user applying the action.
   */
  userId: number;

  /**
   * The description of the action.
   */
  description: string;
}
