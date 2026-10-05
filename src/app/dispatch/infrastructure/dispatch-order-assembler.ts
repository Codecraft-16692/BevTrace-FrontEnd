import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DispatchOrder } from '../domain/model/dispatch-order.entity';
import { DispatchOrderResource, DispatchOrdersResponse } from './dispatch-order-response';

/**
 * Assembler for converting between DispatchOrder domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class DispatchOrderAssembler implements BaseAssembler<
  DispatchOrder,
  DispatchOrderResource,
  DispatchOrdersResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of DispatchOrder domain entities
   */
  toEntitiesFromResponse(response: DispatchOrdersResponse): DispatchOrder[] {
    return response.dispatchOrders.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns DispatchOrder domain entity
   */
  toEntityFromResource(resource: DispatchOrderResource): DispatchOrder {
    return new DispatchOrder({
      id: resource.id,
      managerId: resource.managerId,
      vehicleId: resource.vehicleId,
      destinationId: resource.destinationId,
      scheduledDate: resource.scheduledDate,
      status: resource.status,
      priority: resource.priority,
      estimatedWeight: resource.estimatedWeight,
      requestedQuantity: resource.requestedQuantity,
      deliveredQuantity: resource.deliveredQuantity,
      deliveredAt: resource.deliveredAt,
      departedAt: resource.departedAt,
      cargoValidated: resource.cargoValidated,
      createdAt: resource.createdAt,
      destinationName: resource.destination?.clientName ?? '',
      destinationRegion: resource.destination?.region ?? '',
      destinationLatitude: resource.destination?.latitude ?? 0,
      destinationLongitude: resource.destination?.longitude ?? 0,
      vehiclePlate: resource.vehicle?.plateNumber ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - DispatchOrder domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: DispatchOrder): DispatchOrderResource {
    return {
      id: entity.id,
      managerId: entity.managerId,
      vehicleId: entity.vehicleId,
      destinationId: entity.destinationId,
      scheduledDate: entity.scheduledDate,
      status: entity.status,
      priority: entity.priority,
      estimatedWeight: entity.estimatedWeight,
      requestedQuantity: entity.requestedQuantity,
      deliveredQuantity: entity.deliveredQuantity,
      deliveredAt: entity.deliveredAt,
      departedAt: entity.departedAt,
      cargoValidated: entity.cargoValidated,
      createdAt: entity.createdAt,
    };
  }
}
