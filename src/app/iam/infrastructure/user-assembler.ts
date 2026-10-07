import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { User } from '../domain/model/user.entity';
import { UserResource, UsersResponse } from './user-response';

/**
 * Assembler for converting between User domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class UserAssembler implements BaseAssembler<
  User,
  UserResource,
  UsersResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of User domain entities
   */
  toEntitiesFromResponse(response: UsersResponse): User[] {
    return response.users.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns User domain entity
   */
  toEntityFromResource(resource: UserResource): User {
    return new User({
      id: resource.id,
      roleId: resource.roleId,
      name: resource.name,
      email: resource.email,
      phone: resource.phone,
      active: resource.active,
      createdAt: resource.createdAt,
      roleName: resource.role?.name ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - User domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: User): UserResource {
    return {
      id: entity.id,
      roleId: entity.roleId,
      name: entity.name,
      email: entity.email,
      phone: entity.phone,
      active: entity.active,
      createdAt: entity.createdAt,
    };
  }
}
