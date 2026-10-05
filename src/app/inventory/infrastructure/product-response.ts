import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a beverage product (SKU) for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface ProductResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The stock keeping unit code.
   */
  skuCode: string;

  /**
   * The commercial name of the product.
   */
  name: string;

  /**
   * The product category (Water, Soda, Juice...).
   */
  category: string;

  /**
   * The container volume in milliliters.
   */
  volumeMl: number;

  /**
   * The packaging type (PET, Returnable...).
   */
  packagingType: string;
}

/**
 * Response envelope for a beverage product (SKU) collection queries.
 */
export interface ProductsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  products: ProductResource[];
}
