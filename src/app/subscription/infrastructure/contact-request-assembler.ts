import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ContactRequest } from '../domain/model/contact-request.entity';
import { ContactRequestResource, ContactRequestsResponse } from './contact-request-response';

/**
 * Assembler for converting between ContactRequest domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class ContactRequestAssembler implements BaseAssembler<
  ContactRequest,
  ContactRequestResource,
  ContactRequestsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of ContactRequest domain entities
   */
  toEntitiesFromResponse(response: ContactRequestsResponse): ContactRequest[] {
    return response.requests.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns ContactRequest domain entity
   */
  toEntityFromResource(resource: ContactRequestResource): ContactRequest {
    return new ContactRequest({
      id: resource.id,
      fullName: resource.fullName,
      email: resource.email,
      company: resource.company,
      message: resource.message,
      createdAt: resource.createdAt,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - ContactRequest domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: ContactRequest): ContactRequestResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      email: entity.email,
      company: entity.company,
      message: entity.message,
      createdAt: entity.createdAt,
    };
  }
}
