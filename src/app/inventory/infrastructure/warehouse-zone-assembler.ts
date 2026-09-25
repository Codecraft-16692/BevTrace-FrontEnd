import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { WarehouseZone } from '../domain/model/warehouse-zone.entity';
import { WarehouseZoneResource, WarehouseZonesResponse } from './warehouse-zone-response';

/**
 * Assembler for converting between WarehouseZone domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class WarehouseZoneAssembler implements BaseAssembler<
  WarehouseZone,
  WarehouseZoneResource,
  WarehouseZonesResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of WarehouseZone domain entities
   */
  toEntitiesFromResponse(response: WarehouseZonesResponse): WarehouseZone[] {
    return response.zones.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns WarehouseZone domain entity
   */
  toEntityFromResource(resource: WarehouseZoneResource): WarehouseZone {
    return new WarehouseZone({
      id: resource.id,
      name: resource.name,
      aisle: resource.aisle,
      rack: resource.rack,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - WarehouseZone domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: WarehouseZone): WarehouseZoneResource {
    return {
      id: entity.id,
      name: entity.name,
      aisle: entity.aisle,
      rack: entity.rack,
    };
  }
}
