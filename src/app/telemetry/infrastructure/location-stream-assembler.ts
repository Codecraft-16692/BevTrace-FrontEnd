import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { LocationStream } from '../domain/model/location-stream.entity';
import { LocationStreamResource, LocationStreamsResponse } from './location-stream-response';

/**
 * Assembler for converting between LocationStream domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class LocationStreamAssembler implements BaseAssembler<
  LocationStream,
  LocationStreamResource,
  LocationStreamsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of LocationStream domain entities
   */
  toEntitiesFromResponse(response: LocationStreamsResponse): LocationStream[] {
    return response.streams.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns LocationStream domain entity
   */
  toEntityFromResource(resource: LocationStreamResource): LocationStream {
    return new LocationStream({
      id: resource.id,
      deviceId: resource.deviceId,
      latitude: resource.latitude,
      longitude: resource.longitude,
      speed: resource.speed,
      temperature: resource.temperature,
      timestamp: resource.timestamp,
      deviceCode: resource.device?.deviceCode ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - LocationStream domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: LocationStream): LocationStreamResource {
    return {
      id: entity.id,
      deviceId: entity.deviceId,
      latitude: entity.latitude,
      longitude: entity.longitude,
      speed: entity.speed,
      temperature: entity.temperature,
      timestamp: entity.timestamp,
    };
  }
}
