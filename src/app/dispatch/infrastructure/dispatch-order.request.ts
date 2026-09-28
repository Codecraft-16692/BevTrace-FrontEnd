/**
 * Request payload for creating a dispatch order.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateDispatchOrderRequest {
  /**
   * The identifier of the responsible logistics manager.
   */
  managerId: number;

  /**
   * The identifier of the assigned vehicle.
   */
  vehicleId: number | null;

  /**
   * The identifier of the delivery destination.
   */
  destinationId: number;

  /**
   * The scheduled departure date in ISO date format.
   */
  scheduledDate: string;

  /**
   * The lifecycle status of the dispatch.
   */
  status: 'SCHEDULED' | 'AUTHORIZED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

  /**
   * The operational priority classification.
   */
  priority: 'STANDARD' | 'LOGISTICS' | 'URGENT';

  /**
   * The estimated cargo weight in kilograms.
   */
  estimatedWeight: number;

  /**
   * The number of units requested by the client.
   */
  requestedQuantity: number;

  /**
   * The number of units finally delivered.
   */
  deliveredQuantity: number | null;

  /**
   * The ISO 8601 timestamp of the delivery.
   */
  deliveredAt: string | null;

  /**
   * The ISO 8601 timestamp of the departure.
   */
  departedAt: string | null;

  /**
   * Indicates whether the loaded pallets were validated against the order.
   */
  cargoValidated: boolean;

  /**
   * The ISO 8601 timestamp of creation.
   */
  createdAt: string;
}
