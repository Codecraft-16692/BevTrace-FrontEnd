import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InventoryStore } from '../../../application/inventory.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that runs and confirms the inventory reconciliation.
 *
 * @remarks
 * This presentation component supports the discrepancy alert and the
 * reconciliation user stories. The operator enters the physical count of each
 * batch; differences generate open discrepancies that must be resolved before
 * the logistics manager can confirm the reconciliation.
 */
@Component({
  selector: 'app-reconciliation',
  standalone: true,
  imports: [
    DecimalPipe,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MessageBanner,
    StatusChip,
  ],
  templateUrl: './reconciliation.html',
  styleUrl: './reconciliation.css',
})
export class Reconciliation implements OnInit {
  /**
   * Store that manages inventory state.
   */
  protected readonly store = inject(InventoryStore);

  /**
   * Store that exposes the signed in user.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Physical counts typed by the operator, indexed by batch identifier.
   */
  protected readonly counts = signal<Record<number, string>>({});

  /**
   * Resolution notes typed by the user, indexed by discrepancy identifier.
   */
  protected readonly notes = signal<Record<number, string>>({});

  /**
   * Columns displayed in the reconciliation history table.
   */
  protected readonly historyColumns = ['date', 'batches', 'eri', 'status', 'actions'];

  /**
   * Columns displayed in the discrepancy table.
   */
  protected readonly discrepancyColumns = ['batchNumber', 'expectedQty', 'countedQty', 'difference', 'status', 'actions'];

  /**
   * Lifecycle hook that loads the inventory.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Stores the count typed for a batch.
   *
   * @param batchId - Identifier of the counted batch
   * @param value - Text typed by the operator
   */
  protected setCount(batchId: number, value: string): void {
    this.counts.update((current) => ({ ...current, [batchId]: value }));
  }

  /**
   * Stores the resolution note typed for a discrepancy.
   *
   * @param discrepancyId - Identifier of the discrepancy
   * @param value - Text typed by the user
   */
  protected setNote(discrepancyId: number, value: string): void {
    this.notes.update((current) => ({ ...current, [discrepancyId]: value }));
  }

  /**
   * Fills every count with the current system quantity, to test a clean reconciliation.
   */
  protected fillWithSystem(): void {
    const filled: Record<number, string> = {};
    this.store.availableBatches().forEach((batch) => (filled[batch.id] = String(batch.currentQty)));
    this.counts.set(filled);
  }

  /**
   * Runs the reconciliation with the typed counts.
   */
  protected onRun(): void {
    const entries = Object.entries(this.counts())
      .filter(([, value]) => value !== '' && Number(value) >= 0 && Number.isInteger(Number(value)))
      .map(([batchId, value]) => ({ batchId: Number(batchId), countedQty: Number(value) }));

    this.store.runReconciliation({ userId: this.iamStore.currentUserId() ?? 0, counts: entries });
    this.counts.set({});
  }

  /**
   * Confirms a reconciliation.
   *
   * @param reconciliationId - Identifier of the reconciliation
   */
  protected onConfirm(reconciliationId: number): void {
    this.store.confirmReconciliation({
      reconciliationId,
      userId: this.iamStore.currentUserId() ?? 0,
    });
  }

  /**
   * Resolves a discrepancy with the typed note.
   *
   * @param discrepancyId - Identifier of the discrepancy
   */
  protected onResolve(discrepancyId: number): void {
    this.store.resolveDiscrepancy({ discrepancyId, note: this.notes()[discrepancyId] ?? '' });
  }
}
