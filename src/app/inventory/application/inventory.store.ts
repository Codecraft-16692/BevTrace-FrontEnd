import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { defer, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';

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
import { IncidentStore } from '../../incident/application/incident.store';

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
   * Injector used to reach other bounded contexts lazily.
   */
  private readonly injector = inject(Injector);

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
   * Registers a batch announced by the plant so it can be scanned later.
   *
   * @param command - Command containing the batch data
   */
  registerBatch(command: RegisterBatchCommand): void {
    const batchNumber = command.batchNumber.trim().toUpperCase();

    const operation = this.api.findBatchesByCode(batchNumber).pipe(
      switchMap((existing) =>
        existing.length > 0
          ? throwError(() => new BusinessError('inventory.errors.batch-duplicated', { code: batchNumber }))
          : this.api.createBatch({
              productId: command.productId,
              zoneId: command.zoneId,
              batchNumber,
              initialQty: command.initialQty,
              currentQty: 0,
              status: 'EXPECTED',
              receivedAt: null,
              expirationDate: command.expirationDate,
            }),
      ),
    );

    this.write(operation, 'inventory.errors.generic', () => this.refresh(), {
      key: 'inventory.batch-form.success',
      params: { code: batchNumber },
    });
  }

  /**
   * Registers the entry of a batch by validating the scanned code.
   *
   * @param command - Command containing the scanned code
   */
  receiveBatch(command: ReceiveBatchCommand): void {
    const code = command.scanCode.trim().toUpperCase();

    const operation = this.api.findBatchesByCode(code).pipe(
      switchMap((matches) => {
        const batch = matches[0];
        if (!batch) {
          return throwError(() => new BusinessError('inventory.errors.invalid-code', { code }));
        }
        if (batch.status !== 'EXPECTED') {
          return throwError(() => new BusinessError('inventory.errors.already-received', { code }));
        }
        return this.api.updateBatch(batch.id, {
          status: 'AVAILABLE',
          currentQty: batch.initialQty,
          receivedAt: new Date().toISOString(),
        });
      }),
    );

    this.write(operation, 'inventory.errors.generic', () => this.refresh(), {
      key: 'inventory.entry.success',
      params: { code },
    });
  }

  /**
   * Registers a product waste and deducts it from the batch stock.
   *
   * @param command - Command containing the waste data
   */
  registerWaste(command: RegisterWasteCommand): void {
    const operation = defer(() => {
      const batch = this.batchesSignal().find((item) => item.id === command.batchId);
      if (!batch || batch.status !== 'AVAILABLE') {
        return throwError(() => new BusinessError('inventory.errors.batch-not-available'));
      }
      if (command.quantity > batch.currentQty) {
        return throwError(
          () =>
            new BusinessError('inventory.errors.waste-exceeds-stock', {
              available: batch.currentQty,
              code: batch.batchNumber,
            }),
        );
      }
      const remaining = batch.currentQty - command.quantity;
      return this.api
        .createWasteRecord({
          batchId: command.batchId,
          userId: command.userId,
          quantity: command.quantity,
          reason: command.reason.trim(),
          reportedDate: new Date().toISOString().split('T')[0],
        })
        .pipe(
          switchMap(() =>
            this.api.updateBatch(batch.id, {
              currentQty: remaining,
              status: remaining === 0 ? 'DEPLETED' : 'AVAILABLE',
            }),
          ),
        );
    });

    this.write(operation, 'inventory.errors.generic', () => this.refresh(), {
      key: 'inventory.waste.success',
    });
  }

  /**
   * Runs the physical reconciliation comparing the counts with the system stock.
   *
   * @param command - Command containing the physical counts
   */
  runReconciliation(command: RunReconciliationCommand): void {
    const operation = defer(() => {
      const counted = command.counts.filter((count) => Number.isFinite(count.countedQty));
      if (counted.length === 0) {
        return throwError(() => new BusinessError('inventory.errors.no-counts'));
      }

      const mismatches = counted.filter((count) => {
        const batch = this.batchesSignal().find((item) => item.id === count.batchId);
        return batch !== undefined && batch.currentQty !== count.countedQty;
      });
      const matched = counted.length - mismatches.length;
      const now = new Date().toISOString();
      const clean = mismatches.length === 0;

      return this.api
        .createReconciliation({
          date: now.split('T')[0],
          status: clean ? 'RECONCILED' : 'IN_REVIEW',
          totalBatches: counted.length,
          matchedBatches: matched,
          eriPercentage: Math.round((matched / counted.length) * 1000) / 10,
          confirmedBy: clean ? command.userId : null,
          confirmedAt: clean ? now : null,
        })
        .pipe(
          switchMap((reconciliation) => {
            if (clean) return of(reconciliation);
            return forkJoin(
              mismatches.map((count) => {
                const batch = this.batchesSignal().find((item) => item.id === count.batchId)!;
                return this.api.createDiscrepancy({
                  reconciliationId: reconciliation.id,
                  batchId: batch.id,
                  expectedQty: batch.currentQty,
                  countedQty: count.countedQty,
                  status: 'OPEN',
                  detectedAt: now,
                  resolvedAt: null,
                  resolutionNote: null,
                });
              }),
            ).pipe(map(() => reconciliation));
          }),
          map((reconciliation) => ({ reconciliation, mismatches: mismatches.length })),
        );
    });

    this.write(
      operation,
      'inventory.errors.generic',
      ({ mismatches }) => {
        if (mismatches > 0) {
          this.notifyManagers(mismatches);
        }
        this.refresh();
      },
      { key: 'inventory.reconciliation.run-success' },
    );
  }

  /**
   * Confirms a reconciliation once every discrepancy is resolved.
   *
   * @param command - Command containing the reconciliation and the confirming user
   */
  confirmReconciliation(command: ConfirmReconciliationCommand): void {
    const operation = defer(() => {
      const pending = this.discrepanciesSignal().filter(
        (discrepancy) =>
          discrepancy.reconciliationId === command.reconciliationId && discrepancy.status === 'OPEN',
      );
      if (pending.length > 0) {
        return throwError(
          () => new BusinessError('inventory.errors.pending-discrepancies', { count: pending.length }),
        );
      }
      return this.api.confirmReconciliation(command.reconciliationId, command.userId);
    });

    this.write(operation, 'inventory.errors.generic', () => this.refresh(), {
      key: 'inventory.reconciliation.confirm-success',
    });
  }

  /**
   * Resolves a discrepancy and adjusts the batch stock to the counted quantity.
   *
   * @param command - Command containing the discrepancy and the resolution note
   */
  resolveDiscrepancy(command: ResolveDiscrepancyCommand): void {
    const operation = defer(() => {
      const discrepancy = this.discrepanciesSignal().find((item) => item.id === command.discrepancyId);
      if (!discrepancy) {
        return throwError(() => new BusinessError('inventory.errors.generic'));
      }
      if (command.note.trim().length < 3) {
        return throwError(() => new BusinessError('inventory.errors.note-required'));
      }
      return this.api.resolveDiscrepancy(discrepancy.id, command.note.trim()).pipe(
        switchMap(() =>
          this.api.updateBatch(discrepancy.batchId, {
            currentQty: discrepancy.countedQty,
            status: discrepancy.countedQty === 0 ? 'DEPLETED' : 'AVAILABLE',
          }),
        ),
      );
    });

    this.write(operation, 'inventory.errors.generic', () => this.refresh(), {
      key: 'inventory.reconciliation.resolve-success',
    });
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

  /**
   * Notifies the logistics managers about inventory discrepancies.
   *
   * @param count - Number of discrepancies detected
   */
  private notifyManagers(count: number): void {
    this.injector.get(IncidentStore).notify({
      recipientRole: 'ROLE_LOGISTICS_MANAGER',
      type: 'INVENTORY',
      title: 'Inventory discrepancy',
      message: `The daily reconciliation detected ${count} batch discrepancies that need review.`,
    });
  }
}
