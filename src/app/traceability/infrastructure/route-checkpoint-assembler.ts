import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { RouteCheckpoint } from '../domain/model/route-checkpoint.entity';
import { RouteCheckpointResource, RouteCheckpointsResponse } from './route-checkpoint-response';

/**
 * Assembler for converting between RouteCheckpoint domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class RouteCheckpointAssembler implements BaseAssembler<
  RouteCheckpoint,
  RouteCheckpointResource,
  RouteCheckpointsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of RouteCheckpoint domain entities
   */
  toEntitiesFromResponse(response: RouteCheckpointsResponse): RouteCheckpoint[] {
    return response.checkpoints.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns RouteCheckpoint domain entity
   */
  toEntityFromResource(resource: RouteCheckpointResource): RouteCheckpoint {
    return new RouteCheckpoint({
      id: resource.id,
      logId: resource.logId,
      sequence: resource.sequence,
      locationName: resource.locationName,
      latitude: resource.latitude,
      longitude: resource.longitude,
      status: resource.status,
      reachedAt: resource.reachedAt,
      observation: resource.observation,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - RouteCheckpoint domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: RouteCheckpoint): RouteCheckpointResource {
    return {
      id: entity.id,
      logId: entity.logId,
      sequence: entity.sequence,
      locationName: entity.locationName,
      latitude: entity.latitude,
      longitude: entity.longitude,
      status: entity.status,
      reachedAt: entity.reachedAt,
      observation: entity.observation,
    };
  }
}
