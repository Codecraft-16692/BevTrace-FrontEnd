import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DeviceModel } from '../domain/model/device-model.entity';
import { DeviceModelResource, DeviceModelsResponse } from './device-model-response';

/**
 * Assembler for converting between DeviceModel domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class DeviceModelAssembler implements BaseAssembler<
  DeviceModel,
  DeviceModelResource,
  DeviceModelsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of DeviceModel domain entities
   */
  toEntitiesFromResponse(response: DeviceModelsResponse): DeviceModel[] {
    return response.models.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns DeviceModel domain entity
   */
  toEntityFromResource(resource: DeviceModelResource): DeviceModel {
    return new DeviceModel({
      id: resource.id,
      name: resource.name,
      manufacturer: resource.manufacturer,
      sensors: resource.sensors,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - DeviceModel domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: DeviceModel): DeviceModelResource {
    return {
      id: entity.id,
      name: entity.name,
      manufacturer: entity.manufacturer,
      sensors: entity.sensors,
    };
  }
}
