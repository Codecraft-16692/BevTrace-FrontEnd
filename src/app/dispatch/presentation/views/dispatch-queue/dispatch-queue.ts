import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DispatchStore } from '../../../application/dispatch.store';
import { DispatchOrder } from '../../../domain/model/dispatch-order.entity';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that renders the dispatch queue.
 *
 * @remarks
 * This presentation component follows the "Dispatch Queue" wireframe. It shows
 * the indicators of the queue and a table of dispatch orders sorted by
 * operational priority, with a status filter and access to the dispatch detail.
 */
@Component({
  selector: 'app-dispatch-queue',
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
  templateUrl: './dispatch-queue.html',
  styleUrl: './dispatch-queue.css',
})
export class DispatchQueue implements OnInit {
  /**
   * Store that manages dispatch state.
   */
  protected readonly store = inject(DispatchStore);

  /**
   * Router used to open the dispatch detail.
   */
  private readonly router = inject(Router);

  /**
   * Columns displayed in the queue table.
   */
  protected readonly displayedColumns = ['id', 'priority', 'destination', 'scheduledDate', 'units', 'vehicle', 'status', 'actions'];

  /**
   * Status selected in the filter, empty for every status.
   */
  protected readonly statusFilter = signal<string>('');

  /**
   * Orders matching the active filter.
   */
  protected readonly filtered = computed(() =>
    this.store.orders().filter((order) => !this.statusFilter() || order.status === this.statusFilter()),
  );

  /**
   * Total units waiting in the queue.
   */
  protected readonly queuedUnits = computed(() =>
    this.store.queue().reduce((sum, order) => sum + order.requestedQuantity, 0),
  );

  /**
   * Lifecycle hook that loads the dispatch data.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Opens the detail of a dispatch order.
   *
   * @param order - Order selected by the user
   */
  protected open(order: DispatchOrder): void {
    this.router.navigate(['/dispatch', order.id]).then();
  }

  /**
   * Opens the scheduling form.
   */
  protected create(): void {
    this.router.navigate(['/dispatch/new']).then();
  }
}
