/**
 * Command for scheduling a dispatch order.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface ScheduleDispatchCommand {
  /**
   * The identifier of the responsible manager.
   */
  managerId: number;

  /**
   * The identifier of the delivery destination.
   */
  destinationId: number;

  /**
   * The scheduled departure date in ISO date format.
   */
  scheduledDate: string;

  /**
   * The operational priority.
   */
  priority: 'STANDARD' | 'LOGISTICS' | 'URGENT';

  /**
   * The batches and quantities to dispatch.
   */
  items: { batchId: number; quantity: number }[];
}
