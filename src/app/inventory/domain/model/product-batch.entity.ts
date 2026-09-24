import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a batch of beverage products within the inventory domain.
 *
 * @remarks
 * In Domain-Driven Design, ProductBatch is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the inventory bounded context.
 */
export class ProductBatch implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the product contained in the batch.
   */
  productId: number;

  /**
   * The identifier of the warehouse zone where the batch is stored.
   */
  zoneId: number;

  /**
   * The batch code printed on the pallet label and used for scanning.
   */
  batchNumber: string;

  /**
   * The quantity of units announced for the batch.
   */
  initialQty: number;

  /**
   * The quantity of units currently available.
   */
  currentQty: number;

  /**
   * The lifecycle status of the batch.
   */
  status: 'EXPECTED' | 'AVAILABLE' | 'DEPLETED';

  /**
   * The ISO 8601 timestamp when the batch entered the warehouse.
   */
  receivedAt: string | null;

  /**
   * The expiration date in ISO date format.
   */
  expirationDate: string;

  /**
   * The name of the contained product.
   */
  productName: string;

  /**
   * The SKU of the contained product.
   */
  productSku: string;

  /**
   * The name of the storage zone.
   */
  zoneName: string;

  /**
   * Creates a new ProductBatch entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    productId: number;
    zoneId: number;
    batchNumber: string;
    initialQty: number;
    currentQty: number;
    status: 'EXPECTED' | 'AVAILABLE' | 'DEPLETED';
    receivedAt: string | null;
    expirationDate: string;
    productName: string;
    productSku: string;
    zoneName: string;
  }) {
    this.id = params.id;
    this.productId = params.productId;
    this.zoneId = params.zoneId;
    this.batchNumber = params.batchNumber;
    this.initialQty = params.initialQty;
    this.currentQty = params.currentQty;
    this.status = params.status;
    this.receivedAt = params.receivedAt;
    this.expirationDate = params.expirationDate;
    this.productName = params.productName;
    this.productSku = params.productSku;
    this.zoneName = params.zoneName;
  }
}
