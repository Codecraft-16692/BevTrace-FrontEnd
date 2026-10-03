import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Role } from '../domain/model/role.entity';
import { RoleResource, RolesResponse } from './role-response';

/**
 * Assembler for converting between Role domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class RoleAssembler implements BaseAssembler<
  Role,
  RoleResource,
  RolesResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of Role domain entities
   */
  toEntitiesFromResponse(response: RolesResponse): Role[] {
    return response.roles.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns Role domain entity
   */
  toEntityFromResource(resource: RoleResource): Role {
    return new Role({
      id: resource.id,
      name: resource.name,
      isAdmin: resource.isAdmin,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - Role domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: Role): RoleResource {
    return {
      id: entity.id,
      name: entity.name,
      isAdmin: entity.isAdmin,
    };
  }
}
