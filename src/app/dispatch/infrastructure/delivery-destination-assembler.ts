import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DeliveryDestination } from '../domain/model/delivery-destination.entity';
import { DeliveryDestinationResource, DeliveryDestinationsResponse } from './delivery-destination-response';

/**
 * Assembler for converting between DeliveryDestination domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class DeliveryDestinationAssembler implements BaseAssembler<
  DeliveryDestination,
  DeliveryDestinationResource,
  DeliveryDestinationsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of DeliveryDestination domain entities
   */
  toEntitiesFromResponse(response: DeliveryDestinationsResponse): DeliveryDestination[] {
    return response.destinations.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns DeliveryDestination domain entity
   */
  toEntityFromResource(resource: DeliveryDestinationResource): DeliveryDestination {
    return new DeliveryDestination({
      id: resource.id,
      clientName: resource.clientName,
      address: resource.address,
      latitude: resource.latitude,
      longitude: resource.longitude,
      region: resource.region,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - DeliveryDestination domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: DeliveryDestination): DeliveryDestinationResource {
    return {
      id: entity.id,
      clientName: entity.clientName,
      address: entity.address,
      latitude: entity.latitude,
      longitude: entity.longitude,
      region: entity.region,
    };
  }
}
