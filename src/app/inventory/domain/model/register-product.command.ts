/**
 * Command for adding a product to the catalogue.
 *
 * @remarks
 * In CQRS, this command represents the intent of the logistics manager, captured by the
 * presentation layer and executed by the application store.
 */
export interface RegisterProductCommand {
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
