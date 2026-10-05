import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { CargoAssignment } from '../domain/model/cargo-assignment.entity';
import { CargoAssignmentResource, CargoAssignmentsResponse } from './cargo-assignment-response';

/**
 * Assembler for converting between CargoAssignment domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class CargoAssignmentAssembler implements BaseAssembler<
  CargoAssignment,
  CargoAssignmentResource,
  CargoAssignmentsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of CargoAssignment domain entities
   */
  toEntitiesFromResponse(response: CargoAssignmentsResponse): CargoAssignment[] {
    return response.cargoAssignments.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns CargoAssignment domain entity
   */
  toEntityFromResource(resource: CargoAssignmentResource): CargoAssignment {
    return new CargoAssignment({
      id: resource.id,
      dispatchOrderId: resource.dispatchOrderId,
      batchId: resource.batchId,
      quantity: resource.quantity,
      totalWeight: resource.totalWeight,
      palletCount: resource.palletCount,
      batchNumber: resource.batch?.batchNumber ?? '',
      palletCodes: Array.from({ length: resource.palletCount }, (_, index) => `${resource.batch?.batchNumber ?? 'LOT'}-P${index + 1}`),
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - CargoAssignment domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: CargoAssignment): CargoAssignmentResource {
    return {
      id: entity.id,
      dispatchOrderId: entity.dispatchOrderId,
      batchId: entity.batchId,
      quantity: entity.quantity,
      totalWeight: entity.totalWeight,
      palletCount: entity.palletCount,
    };
  }
}
