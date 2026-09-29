import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a dispatch order for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface DispatchOrderResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

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

  /**
   * Embedded destination returned by the `_expand` query.
   */
  destination?: { clientName: string; region: string; latitude: number; longitude: number };

  /**
   * Embedded vehicle returned by the `_expand` query.
   */
  vehicle?: { plateNumber: string };
}

/**
 * Response envelope for a dispatch order collection queries.
 */
export interface DispatchOrdersResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  dispatchOrders: DispatchOrderResource[];
}
