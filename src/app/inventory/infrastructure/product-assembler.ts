import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Product } from '../domain/model/product.entity';
import { ProductResource, ProductsResponse } from './product-response';

/**
 * Assembler for converting between Product domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class ProductAssembler implements BaseAssembler<
  Product,
  ProductResource,
  ProductsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of Product domain entities
   */
  toEntitiesFromResponse(response: ProductsResponse): Product[] {
    return response.products.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns Product domain entity
   */
  toEntityFromResource(resource: ProductResource): Product {
    return new Product({
      id: resource.id,
      skuCode: resource.skuCode,
      name: resource.name,
      category: resource.category,
      volumeMl: resource.volumeMl,
      packagingType: resource.packagingType,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - Product domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: Product): ProductResource {
    return {
      id: entity.id,
      skuCode: entity.skuCode,
      name: entity.name,
      category: entity.category,
      volumeMl: entity.volumeMl,
      packagingType: entity.packagingType,
    };
  }
}
