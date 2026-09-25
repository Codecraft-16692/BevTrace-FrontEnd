import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { ProductBatch } from '../domain/model/product-batch.entity';
import { ProductBatchResource, ProductBatchesResponse } from './product-batch-response';

/**
 * Assembler for converting between ProductBatch domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class ProductBatchAssembler implements BaseAssembler<
  ProductBatch,
  ProductBatchResource,
  ProductBatchesResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of ProductBatch domain entities
   */
  toEntitiesFromResponse(response: ProductBatchesResponse): ProductBatch[] {
    return response.batches.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns ProductBatch domain entity
   */
  toEntityFromResource(resource: ProductBatchResource): ProductBatch {
    return new ProductBatch({
      id: resource.id,
      productId: resource.productId,
      zoneId: resource.zoneId,
      batchNumber: resource.batchNumber,
      initialQty: resource.initialQty,
      currentQty: resource.currentQty,
      status: resource.status,
      receivedAt: resource.receivedAt,
      expirationDate: resource.expirationDate,
      productName: resource.product?.name ?? '',
      productSku: resource.product?.skuCode ?? '',
      zoneName: resource.zone?.name ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - ProductBatch domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: ProductBatch): ProductBatchResource {
    return {
      id: entity.id,
      productId: entity.productId,
      zoneId: entity.zoneId,
      batchNumber: entity.batchNumber,
      initialQty: entity.initialQty,
      currentQty: entity.currentQty,
      status: entity.status,
      receivedAt: entity.receivedAt,
      expirationDate: entity.expirationDate,
    };
  }
}
