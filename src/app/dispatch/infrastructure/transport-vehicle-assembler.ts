import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { TransportVehicle } from '../domain/model/transport-vehicle.entity';
import { TransportVehicleResource, TransportVehiclesResponse } from './transport-vehicle-response';

/**
 * Assembler for converting between TransportVehicle domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class TransportVehicleAssembler implements BaseAssembler<
  TransportVehicle,
  TransportVehicleResource,
  TransportVehiclesResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of TransportVehicle domain entities
   */
  toEntitiesFromResponse(response: TransportVehiclesResponse): TransportVehicle[] {
    return response.vehicles.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns TransportVehicle domain entity
   */
  toEntityFromResource(resource: TransportVehicleResource): TransportVehicle {
    return new TransportVehicle({
      id: resource.id,
      driverId: resource.driverId,
      plateNumber: resource.plateNumber,
      maxCapacity: resource.maxCapacity,
      isAvailable: resource.isAvailable,
      driverName: resource.driver?.fullName ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - TransportVehicle domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: TransportVehicle): TransportVehicleResource {
    return {
      id: entity.id,
      driverId: entity.driverId,
      plateNumber: entity.plateNumber,
      maxCapacity: entity.maxCapacity,
      isAvailable: entity.isAvailable,
    };
  }
}
