import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a product waste (shrinkage) record within the inventory domain.
 *
 * @remarks
 * In Domain-Driven Design, WasteRecord is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the inventory bounded context.
 */
export class WasteRecord implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the affected batch.
   */
  batchId: number;

  /**
   * The identifier of the user who reported the waste.
   */
  userId: number;

  /**
   * The number of units lost.
   */
  quantity: number;

  /**
   * The reason of the waste.
   */
  reason: string;

  /**
   * The report date in ISO date format.
   */
  reportedDate: string;

  /**
   * The code of the affected batch.
   */
  batchNumber: string;

  /**
   * The name of the reporting user.
   */
  userName: string;

  /**
   * Creates a new WasteRecord entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    batchId: number;
    userId: number;
    quantity: number;
    reason: string;
    reportedDate: string;
    batchNumber: string;
    userName: string;
  }) {
    this.id = params.id;
    this.batchId = params.batchId;
    this.userId = params.userId;
    this.quantity = params.quantity;
    this.reason = params.reason;
    this.reportedDate = params.reportedDate;
    this.batchNumber = params.batchNumber;
    this.userName = params.userName;
  }
}
