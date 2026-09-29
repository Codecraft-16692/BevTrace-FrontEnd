import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Driver } from '../domain/model/driver.entity';
import { DriverResource, DriversResponse } from './driver-response';

/**
 * Assembler for converting between Driver domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class DriverAssembler implements BaseAssembler<
  Driver,
  DriverResource,
  DriversResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of Driver domain entities
   */
  toEntitiesFromResponse(response: DriversResponse): Driver[] {
    return response.drivers.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns Driver domain entity
   */
  toEntityFromResource(resource: DriverResource): Driver {
    return new Driver({
      id: resource.id,
      fullName: resource.fullName,
      licenseNumber: resource.licenseNumber,
      status: resource.status,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - Driver domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: Driver): DriverResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      licenseNumber: entity.licenseNumber,
      status: entity.status,
    };
  }
}
