import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InventoryStore } from '../../../application/inventory.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that renders the inventory and shrinkage catalog.
 *
 * @remarks
 * This presentation component follows the "Inventory & Shrinkage Catalog"
 * wireframe. It shows the warehouse indicators (total units, active batches,
 * shrinkage rate) and a searchable, paginated table of batches with their
 * storage zone and status.
 */
@Component({
  selector: 'app-inventory-catalog',
  standalone: true,
  imports: [
    DecimalPipe,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MessageBanner,
    StatusChip,
  ],
  templateUrl: './inventory-catalog.html',
  styleUrl: './inventory-catalog.css',
})
export class InventoryCatalog implements OnInit {
  /**
   * Store that manages inventory state.
   */
  protected readonly store = inject(InventoryStore);

  /**
   * Columns displayed in the batch table.
   */
  protected readonly displayedColumns = [
    'batchNumber',
    'product',
    'zone',
    'currentQty',
    'expirationDate',
    'status',
  ];

  /**
   * Text typed in the search box.
   */
  protected readonly search = signal<string>('');

  /**
   * Status selected in the filter, empty for every status.
   */
  protected readonly statusFilter = signal<string>('');

  /**
   * Zone selected in the filter, empty for every zone.
   */
  protected readonly zoneFilter = signal<string>('');

  /**
   * Current page index of the paginator.
   */
  protected readonly pageIndex = signal<number>(0);

  /**
   * Current page size of the paginator.
   */
  protected readonly pageSize = signal<number>(8);

  /**
   * Batches matching the active filters.
   */
  protected readonly filtered = computed(() => {
    const text = this.search().trim().toLowerCase();
    return this.store.batches().filter((batch) => {
      const matchesText =
        !text ||
        batch.batchNumber.toLowerCase().includes(text) ||
        batch.productName.toLowerCase().includes(text) ||
        batch.productSku.toLowerCase().includes(text);
      const matchesStatus = !this.statusFilter() || batch.status === this.statusFilter();
      const matchesZone = !this.zoneFilter() || String(batch.zoneId) === this.zoneFilter();
      return matchesText && matchesStatus && matchesZone;
    });
  });

  /**
   * Batches of the current page.
   */
  protected readonly page = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    return this.filtered().slice(start, start + this.pageSize());
  });

  /**
   * Lifecycle hook that loads the inventory.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Updates the search text and returns to the first page.
   *
   * @param value - Text typed by the user
   */
  protected onSearch(value: string): void {
    this.search.set(value);
    this.pageIndex.set(0);
  }

  /**
   * Updates the status filter and returns to the first page.
   *
   * @param value - Selected status
   */
  protected onStatus(value: string): void {
    this.statusFilter.set(value);
    this.pageIndex.set(0);
  }

  /**
   * Updates the zone filter and returns to the first page.
   *
   * @param value - Selected zone identifier
   */
  protected onZone(value: string): void {
    this.zoneFilter.set(value);
    this.pageIndex.set(0);
  }

  /**
   * Handles paginator events.
   *
   * @param event - Page event emitted by the paginator
   */
  protected onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }
}
