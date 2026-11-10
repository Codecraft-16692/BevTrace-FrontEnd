/**
 * Request payload to schedule a dispatch order (POST /dispatch-orders).
 *
 * @remarks
 * The manager comes from the token; status, weight and pallets are computed by the backend.
 */
export interface ScheduleDispatchOrderRequest {
  destinationId: number;

  scheduledDate: string;

  priority: 'STANDARD' | 'LOGISTICS' | 'URGENT';

  items: { batchId: number; quantity: number }[];
}
