import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { BaseStore } from '../../shared/application/base-store';
import { BusinessError } from '../../shared/domain/model/business-error';

import { Product } from '../domain/model/product.entity';
import { WarehouseZone } from '../domain/model/warehouse-zone.entity';
import { ProductBatch } from '../domain/model/product-batch.entity';
import { WasteRecord } from '../domain/model/waste-record.entity';
import { InventoryReconciliation } from '../domain/model/inventory-reconciliation.entity';
import { InventoryDiscrepancy } from '../domain/model/inventory-discrepancy.entity';
import { RegisterBatchCommand } from '../domain/model/register-batch.command';
import { ReceiveBatchCommand } from '../domain/model/receive-batch.command';
import { RegisterWasteCommand } from '../domain/model/register-waste.command';
import { RunReconciliationCommand } from '../domain/model/run-reconciliation.command';
import { ConfirmReconciliationCommand } from '../domain/model/confirm-reconciliation.command';
import { ResolveDiscrepancyCommand } from '../domain/model/resolve-discrepancy.command';

import { InventoryApi } from '../infrastructure/inventory-api';

/**
 * Signal-based application store for the Inventory bounded context.
 *
 * @remarks
 * This store coordinates the presentation layer with the inventory API facade.
 * Because the mock REST API cannot enforce domain rules, the store validates the
 * business rules of the user stories: scanned code validation, waste limited to
 * the available stock, daily reconciliation and discrepancy handling.
 */
@Injectable({ providedIn: 'root' })
export class InventoryStore extends BaseStore {
  /**
   * API facade used to reach the inventory endpoints.
   */
  private readonly api = inject(InventoryApi);

  /**
   * Internal signal containing the product catalog.
   */
  private readonly productsSignal = signal<Product[]>([]);

  /**
   * Internal signal containing the warehouse zones.
   */
  private readonly zonesSignal = signal<WarehouseZone[]>([]);

  /**
   * Internal signal containing the product batches.
   */
  private readonly batchesSignal = signal<ProductBatch[]>([]);

  /**
   * Internal signal containing the waste records.
   */
  private readonly wasteSignal = signal<WasteRecord[]>([]);

  /**
   * Internal signal containing the reconciliations.
   */
  private readonly reconciliationsSignal = signal<InventoryReconciliation[]>([]);

  /**
   * Internal signal containing the discrepancies.
   */
  private readonly discrepanciesSignal = signal<InventoryDiscrepancy[]>([]);

  /**
   * Readonly signal exposing the product catalog.
   */
  readonly products = this.productsSignal.asReadonly();

  /**
   * Readonly signal exposing the warehouse zones.
   */
  readonly zones = this.zonesSignal.asReadonly();

  /**
   * Readonly signal exposing the product batches.
   */
  readonly batches = this.batchesSignal.asReadonly();

  /**
   * Readonly signal exposing the waste records, newest first.
   */
  readonly wasteRecords = computed(() =>
    [...this.wasteSignal()].sort((a, b) => b.reportedDate.localeCompare(a.reportedDate)),
  );

  /**
   * Readonly signal exposing the reconciliations, newest first.
   */
  readonly reconciliations = computed(() =>
    [...this.reconciliationsSignal()].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id),
  );

  /**
   * Readonly signal exposing the discrepancies, newest first.
   */
  readonly discrepancies = computed(() =>
    [...this.discrepanciesSignal()].sort((a, b) => b.detectedAt.localeCompare(a.detectedAt)),
  );

  /**
   * Batches that are stored in the warehouse and can be counted or dispatched.
   */
  readonly availableBatches = computed(() =>
    this.batchesSignal().filter((batch) => batch.status === 'AVAILABLE'),
  );

  /**
   * Batches announced by the plant and still waiting to be scanned.
   */
  readonly expectedBatches = computed(() =>
    this.batchesSignal().filter((batch) => batch.status === 'EXPECTED'),
  );

  /**
   * Total units currently stored in the warehouse.
   */
  readonly totalUnits = computed(() =>
    this.availableBatches().reduce((sum, batch) => sum + batch.currentQty, 0),
  );

  /**
   * Total units lost in the registered waste records.
   */
  readonly totalWaste = computed(() =>
    this.wasteSignal().reduce((sum, record) => sum + record.quantity, 0),
  );

  /**
   * Shrinkage rate as a percentage of the units received in the warehouse.
   */
  readonly shrinkageRate = computed(() => {
    const received = this.batchesSignal()
      .filter((batch) => batch.status !== 'EXPECTED')
      .reduce((sum, batch) => sum + batch.initialQty, 0);
    return received === 0 ? 0 : Math.round((this.totalWaste() / received) * 10000) / 100;
  });

  /**
   * Discrepancies that still need to be resolved.
   */
  readonly openDiscrepancies = computed(() =>
    this.discrepancies().filter((discrepancy) => discrepancy.status === 'OPEN'),
  );

  /**
   * Latest reconciliation waiting for confirmation, if any.
   */
  readonly pendingReconciliation = computed(
    () => this.reconciliations().find((reconciliation) => reconciliation.status === 'IN_REVIEW') ?? null,
  );

  /**
   * Loads every inventory collection.
   */
  loadAll(): void {
    this.read(this.snapshot$(), 'inventory.errors.load', (snapshot) => this.applySnapshot(snapshot));
  }

  /**
   * Registers an expected batch. The backend rejects duplicated codes.
   *
   * @param command - Batch registration command
   */
  registerBatch(command: RegisterBatchCommand): void {
    const batchNumber = command.batchNumber.trim().toUpperCase();
    this.write(
      this.api.registerBatch({
        productId: command.productId,
        zoneId: command.zoneId,
        batchNumber,
        initialQty: command.initialQty,
        expirationDate: command.expirationDate,
      }),
      'inventory.errors.generic',
      () => this.refresh(),
      { key: 'inventory.batch-form.success', params: { code: batchNumber } },
    );
  }

  /**
   * Receives an expected batch by its scanned code.
   *
   * @param command - Batch reception command
   */
  receiveBatch(command: ReceiveBatchCommand): void {
    const code = command.scanCode.trim().toUpperCase();
    this.write(this.api.receiveBatch(code), 'inventory.errors.generic', () => this.refresh(), {
      key: 'inventory.entry.success',
      params: { code },
    });
  }

  /**
   * Registers a waste record. The backend deducts the stock.
   *
   * @param command - Waste registration command
   */
  registerWaste(command: RegisterWasteCommand): void {
    this.write(
      this.api.registerWaste({
        batchId: command.batchId,
        quantity: command.quantity,
        reason: command.reason.trim(),
      }),
      'inventory.errors.generic',
      () => this.refresh(),
      { key: 'inventory.waste.success' },
    );
  }

  /**
   * Runs a physical-count reconciliation. The backend creates the discrepancies
   * and notifies the managers.
   *
   * @param command - Reconciliation command with the counted quantities
   */
  runReconciliation(command: RunReconciliationCommand): void {
    const counts = command.counts.filter((count) => Number.isFinite(count.countedQty));
    if (counts.length === 0) {
      this.startOperation();
      this.failOperation(new BusinessError('inventory.errors.no-counts'), '');
      return;
    }

    this.write(
      this.api.runReconciliation(counts),
      'inventory.errors.generic',
      () => this.refresh(),
      { key: 'inventory.reconciliation.run-success' },
    );
  }

  /**
   * Confirms a reconciliation once every discrepancy is resolved.
   *
   * @param command - Confirmation command
   */
  confirmReconciliation(command: ConfirmReconciliationCommand): void {
    this.write(
      this.api.confirmReconciliation(command.reconciliationId),
      'inventory.errors.generic',
      () => this.refresh(),
      { key: 'inventory.reconciliation.confirm-success' },
    );
  }

  /**
   * Resolves a discrepancy. The backend adjusts the batch stock.
   *
   * @param command - Resolution command with the explanatory note
   */
  resolveDiscrepancy(command: ResolveDiscrepancyCommand): void {
    if (command.note.trim().length < 3) {
      this.startOperation();
      this.failOperation(new BusinessError('inventory.errors.note-required'), '');
      return;
    }

    this.write(
      this.api.resolveDiscrepancy(command.discrepancyId, command.note.trim()),
      'inventory.errors.generic',
      () => this.refresh(),
      { key: 'inventory.reconciliation.resolve-success' },
    );
  }

  /**
   * Builds the observable that retrieves every inventory collection.
   *
   * @returns Observable emitting the whole inventory snapshot
   */
  private snapshot$(): Observable<{
    products: Product[];
    zones: WarehouseZone[];
    batches: ProductBatch[];
    waste: WasteRecord[];
    reconciliations: InventoryReconciliation[];
    discrepancies: InventoryDiscrepancy[];
  }> {
    return forkJoin({
      products: this.api.getProducts(),
      zones: this.api.getZones(),
      batches: this.api.getBatches(),
      waste: this.api.getWasteRecords(),
      reconciliations: this.api.getReconciliations(),
      discrepancies: this.api.getDiscrepancies(),
    });
  }

  /**
   * Stores a snapshot in the signals of the store.
   *
   * @param snapshot - Inventory snapshot retrieved from the API
   */
  private applySnapshot(snapshot: {
    products: Product[];
    zones: WarehouseZone[];
    batches: ProductBatch[];
    waste: WasteRecord[];
    reconciliations: InventoryReconciliation[];
    discrepancies: InventoryDiscrepancy[];
  }): void {
    this.productsSignal.set(snapshot.products);
    this.zonesSignal.set(snapshot.zones);
    this.batchesSignal.set(snapshot.batches);
    this.wasteSignal.set(snapshot.waste);
    this.reconciliationsSignal.set(snapshot.reconciliations);
    this.discrepanciesSignal.set(snapshot.discrepancies);
  }

  /**
   * Reloads the inventory silently after a write operation.
   */
  private refresh(): void {
    this.snapshot$().subscribe((snapshot) => this.applySnapshot(snapshot));
  }
}
