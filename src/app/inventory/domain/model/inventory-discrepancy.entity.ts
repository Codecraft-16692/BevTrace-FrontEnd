import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an inventory discrepancy within the inventory domain.
 *
 * @remarks
 * In Domain-Driven Design, InventoryDiscrepancy is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the inventory bounded context.
 */
export class InventoryDiscrepancy implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the reconciliation that detected the discrepancy.
   */
  reconciliationId: number;

  /**
   * The identifier of the batch with the discrepancy.
   */
  batchId: number;

  /**
   * The quantity registered in the system.
   */
  expectedQty: number;

  /**
   * The quantity counted physically.
   */
  countedQty: number;

  /**
   * The discrepancy status.
   */
  status: 'OPEN' | 'RESOLVED';

  /**
   * The ISO 8601 timestamp of detection.
   */
  detectedAt: string;

  /**
   * The ISO 8601 timestamp of resolution.
   */
  resolvedAt: string | null;

  /**
   * The note registered when the discrepancy was resolved.
   */
  resolutionNote: string | null;

  /**
   * The code of the batch with the discrepancy.
   */
  batchNumber: string;

  /**
   * The difference between counted and expected units.
   */
  difference: number;

  /**
   * Creates a new InventoryDiscrepancy entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    reconciliationId: number;
    batchId: number;
    expectedQty: number;
    countedQty: number;
    status: 'OPEN' | 'RESOLVED';
    detectedAt: string;
    resolvedAt: string | null;
    resolutionNote: string | null;
    batchNumber: string;
    difference: number;
  }) {
    this.id = params.id;
    this.reconciliationId = params.reconciliationId;
    this.batchId = params.batchId;
    this.expectedQty = params.expectedQty;
    this.countedQty = params.countedQty;
    this.status = params.status;
    this.detectedAt = params.detectedAt;
    this.resolvedAt = params.resolvedAt;
    this.resolutionNote = params.resolutionNote;
    this.batchNumber = params.batchNumber;
    this.difference = params.difference;
  }
}
