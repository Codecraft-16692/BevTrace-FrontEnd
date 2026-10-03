import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a beverage product (SKU) within the inventory domain.
 *
 * @remarks
 * In Domain-Driven Design, Product is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the inventory bounded context.
 */
export class Product implements BaseEntity {
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

  /**
   * Creates a new Product entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    skuCode: string;
    name: string;
    category: string;
    volumeMl: number;
    packagingType: string;
  }) {
    this.id = params.id;
    this.skuCode = params.skuCode;
    this.name = params.name;
    this.category = params.category;
    this.volumeMl = params.volumeMl;
    this.packagingType = params.packagingType;
  }
}
