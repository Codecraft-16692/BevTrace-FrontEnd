import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CorrectiveAction } from '../domain/model/corrective-action.entity';
import { CorrectiveActionResource, CorrectiveActionsResponse } from './corrective-action-response';

/**
 * Assembler for converting between CorrectiveAction domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class CorrectiveActionAssembler implements BaseAssembler<
  CorrectiveAction,
  CorrectiveActionResource,
  CorrectiveActionsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of CorrectiveAction domain entities
   */
  toEntitiesFromResponse(response: CorrectiveActionsResponse): CorrectiveAction[] {
    return response.actions.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns CorrectiveAction domain entity
   */
  toEntityFromResource(resource: CorrectiveActionResource): CorrectiveAction {
    return new CorrectiveAction({
      id: resource.id,
      incidentId: resource.incidentId,
      userId: resource.userId,
      description: resource.description,
      appliedAt: resource.appliedAt,
      appliedByName: resource.user?.name ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - CorrectiveAction domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: CorrectiveAction): CorrectiveActionResource {
    return {
      id: entity.id,
      incidentId: entity.incidentId,
      userId: entity.userId,
      description: entity.description,
      appliedAt: entity.appliedAt,
    };
  }
}
