/**
 * Request payload for creating a beverage product (SKU).
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateProductRequest {
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
