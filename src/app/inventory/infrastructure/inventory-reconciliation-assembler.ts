import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { InventoryReconciliation } from '../domain/model/inventory-reconciliation.entity';
import { InventoryReconciliationResource, InventoryReconciliationsResponse } from './inventory-reconciliation-response';

/**
 * Assembler for converting between InventoryReconciliation domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class InventoryReconciliationAssembler implements BaseAssembler<
  InventoryReconciliation,
  InventoryReconciliationResource,
  InventoryReconciliationsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of InventoryReconciliation domain entities
   */
  toEntitiesFromResponse(response: InventoryReconciliationsResponse): InventoryReconciliation[] {
    return response.reconciliations.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns InventoryReconciliation domain entity
   */
  toEntityFromResource(resource: InventoryReconciliationResource): InventoryReconciliation {
    return new InventoryReconciliation({
      id: resource.id,
      date: resource.date,
      status: resource.status,
      totalBatches: resource.totalBatches,
      matchedBatches: resource.matchedBatches,
      eriPercentage: resource.eriPercentage,
      confirmedBy: resource.confirmedBy,
      confirmedAt: resource.confirmedAt,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - InventoryReconciliation domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: InventoryReconciliation): InventoryReconciliationResource {
    return {
      id: entity.id,
      date: entity.date,
      status: entity.status,
      totalBatches: entity.totalBatches,
      matchedBatches: entity.matchedBatches,
      eriPercentage: entity.eriPercentage,
      confirmedBy: entity.confirmedBy,
      confirmedAt: entity.confirmedAt,
    };
  }
}
