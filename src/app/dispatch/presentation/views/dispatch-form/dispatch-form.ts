import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DispatchStore } from '../../../application/dispatch.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Editable cargo line of the scheduling form.
 */
interface CargoLine {
  /**
   * Identifier of the selected batch.
   */
  batchId: number | null;

  /**
   * Units requested from the batch.
   */
  quantity: number;
}

/**
 * Component that schedules a dispatch order.
 *
 * @remarks
 * This presentation component supports the "schedule dispatch" user story. The
 * manager chooses a destination, a date, a priority and one or more batches
 * with their quantities. The store rejects quantities above the free stock.
 */
@Component({
  selector: 'app-dispatch-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, MatIconModule, MatProgressSpinnerModule, MessageBanner],
  templateUrl: './dispatch-form.html',
  styleUrl: './dispatch-form.css',
})
export class DispatchForm implements OnInit {
  /**
   * Store that manages dispatch state.
   */
  protected readonly store = inject(DispatchStore);

  /**
   * Store that exposes the signed in manager.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * Router used to open the detail of the created dispatch.
   */
  private readonly router = inject(Router);

  /**
   * Earliest selectable date (today).
   */
  protected readonly today = new Date().toISOString().split('T')[0];

  /**
   * Priorities offered to the manager.
   */
  protected readonly priorities = ['STANDARD', 'LOGISTICS', 'URGENT'] as const;

  /**
   * Cargo lines typed by the manager.
   */
  protected readonly lines = signal<CargoLine[]>([{ batchId: null, quantity: 0 }]);

  /**
   * Total units of the cargo lines.
   */
  protected readonly totalUnits = computed(() =>
    this.lines().reduce((sum, line) => sum + (Number(line.quantity) || 0), 0),
  );

  /**
   * Reactive form used to capture the dispatch header.
   */
  protected readonly form = new FormGroup({
    destinationId: new FormControl<number | null>(null, [Validators.required]),
    scheduledDate: new FormControl<string>(this.today, {
      nonNullable: true,
      validators: [Validators.required],
    }),
    priority: new FormControl<(typeof this.priorities)[number]>('STANDARD', { nonNullable: true }),
  });

  /**
   * Lifecycle hook that loads destinations and stock.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Adds an empty cargo line.
   */
  protected addLine(): void {
    this.lines.update((lines) => [...lines, { batchId: null, quantity: 0 }]);
  }

  /**
   * Removes a cargo line.
   *
   * @param index - Position of the line to remove
   */
  protected removeLine(index: number): void {
    this.lines.update((lines) => (lines.length > 1 ? lines.filter((_, i) => i !== index) : lines));
  }

  /**
   * Updates the batch of a cargo line.
   *
   * @param index - Position of the line
   * @param value - Identifier typed in the select
   */
  protected setBatch(index: number, value: string): void {
    this.lines.update((lines) =>
      lines.map((line, i) => (i === index ? { ...line, batchId: value ? Number(value) : null } : line)),
    );
  }

  /**
   * Updates the quantity of a cargo line.
   *
   * @param index - Position of the line
   * @param value - Quantity typed in the input
   */
  protected setQuantity(index: number, value: string): void {
    this.lines.update((lines) => lines.map((line, i) => (i === index ? { ...line, quantity: Number(value) } : line)));
  }

  /**
   * Submits the dispatch form.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const items = this.lines()
      .filter((line) => line.batchId !== null)
      .map((line) => ({ batchId: line.batchId as number, quantity: Number(line.quantity) }));

    this.store.scheduleDispatch(
      {
        managerId: this.iamStore.currentUserId() ?? 0,
        destinationId: Number(value.destinationId),
        scheduledDate: value.scheduledDate,
        priority: value.priority,
        items,
      },
      (orderId) => this.router.navigate(['/dispatch', orderId]).then(),
    );
  }

  /**
   * Formats the free stock of a batch for the selector.
   *
   * @param batchId - Identifier of the batch
   * @returns Free units of the batch
   */
  protected freeOf(batchId: number): number {
    const batch = this.store.dispatchableBatches().find((item) => item.id === batchId);
    return batch ? this.store.freeStock(batch) : 0;
  }
}
