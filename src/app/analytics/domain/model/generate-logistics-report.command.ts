/**
 * Command for generating the consolidated logistics report.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface GenerateLogisticsReportCommand {
  /**
   * The identifier of the user generating the report.
   */
  userId: number;

  /**
   * The start of the evaluated period in ISO date format.
   */
  periodStart: string;

  /**
   * The end of the evaluated period in ISO date format.
   */
  periodEnd: string;
}
