import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a physical inventory reconciliation within the inventory domain.
 *
 * @remarks
 * In Domain-Driven Design, InventoryReconciliation is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the inventory bounded context.
 */
export class InventoryReconciliation implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The reconciliation date in ISO date format.
   */
  date: string;

  /**
   * The reconciliation status.
   */
  status: 'IN_REVIEW' | 'RECONCILED';

  /**
   * The number of batches counted.
   */
  totalBatches: number;

  /**
   * The number of batches whose count matches the system.
   */
  matchedBatches: number;

  /**
   * The Inventory Record Accuracy (ERI) percentage.
   */
  eriPercentage: number;

  /**
   * The identifier of the user who confirmed the reconciliation.
   */
  confirmedBy: number | null;

  /**
   * The ISO 8601 timestamp of the confirmation.
   */
  confirmedAt: string | null;

  /**
   * Creates a new InventoryReconciliation entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    date: string;
    status: 'IN_REVIEW' | 'RECONCILED';
    totalBatches: number;
    matchedBatches: number;
    eriPercentage: number;
    confirmedBy: number | null;
    confirmedAt: string | null;
  }) {
    this.id = params.id;
    this.date = params.date;
    this.status = params.status;
    this.totalBatches = params.totalBatches;
    this.matchedBatches = params.matchedBatches;
    this.eriPercentage = params.eriPercentage;
    this.confirmedBy = params.confirmedBy;
    this.confirmedAt = params.confirmedAt;
  }
}
