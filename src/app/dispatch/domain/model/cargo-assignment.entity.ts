import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a cargo assignment within the dispatch domain.
 *
 * @remarks
 * In Domain-Driven Design, CargoAssignment is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the dispatch bounded context.
 */
export class CargoAssignment implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the dispatch order.
   */
  dispatchOrderId: number;

  /**
   * The identifier of the batch supplying the cargo.
   */
  batchId: number;

  /**
   * The number of units assigned.
   */
  quantity: number;

  /**
   * The total weight in kilograms.
   */
  totalWeight: number;

  /**
   * The number of pallets loaded.
   */
  palletCount: number;

  /**
   * The code of the batch supplying the cargo.
   */
  batchNumber: string;

  /**
   * The expected pallet labels derived from the batch code.
   */
  palletCodes: string[];

  /**
   * Creates a new CargoAssignment entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    dispatchOrderId: number;
    batchId: number;
    quantity: number;
    totalWeight: number;
    palletCount: number;
    batchNumber: string;
    palletCodes: string[];
  }) {
    this.id = params.id;
    this.dispatchOrderId = params.dispatchOrderId;
    this.batchId = params.batchId;
    this.quantity = params.quantity;
    this.totalWeight = params.totalWeight;
    this.palletCount = params.palletCount;
    this.batchNumber = params.batchNumber;
    this.palletCodes = params.palletCodes;
  }
}
