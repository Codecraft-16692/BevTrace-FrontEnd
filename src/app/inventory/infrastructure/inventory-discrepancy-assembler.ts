import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { InventoryDiscrepancy } from '../domain/model/inventory-discrepancy.entity';
import { InventoryDiscrepancyResource, InventoryDiscrepanciesResponse } from './inventory-discrepancy-response';

/**
 * Assembler for converting between InventoryDiscrepancy domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class InventoryDiscrepancyAssembler implements BaseAssembler<
  InventoryDiscrepancy,
  InventoryDiscrepancyResource,
  InventoryDiscrepanciesResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of InventoryDiscrepancy domain entities
   */
  toEntitiesFromResponse(response: InventoryDiscrepanciesResponse): InventoryDiscrepancy[] {
    return response.discrepancies.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns InventoryDiscrepancy domain entity
   */
  toEntityFromResource(resource: InventoryDiscrepancyResource): InventoryDiscrepancy {
    return new InventoryDiscrepancy({
      id: resource.id,
      reconciliationId: resource.reconciliationId,
      batchId: resource.batchId,
      expectedQty: resource.expectedQty,
      countedQty: resource.countedQty,
      status: resource.status,
      detectedAt: resource.detectedAt,
      resolvedAt: resource.resolvedAt,
      resolutionNote: resource.resolutionNote,
      batchNumber: resource.batch?.batchNumber ?? '',
      difference: resource.countedQty - resource.expectedQty,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - InventoryDiscrepancy domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: InventoryDiscrepancy): InventoryDiscrepancyResource {
    return {
      id: entity.id,
      reconciliationId: entity.reconciliationId,
      batchId: entity.batchId,
      expectedQty: entity.expectedQty,
      countedQty: entity.countedQty,
      status: entity.status,
      detectedAt: entity.detectedAt,
      resolvedAt: entity.resolvedAt,
      resolutionNote: entity.resolutionNote,
    };
  }
}
