import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InventoryStore } from '../../../application/inventory.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component that registers a batch announced by the plant.
 *
 * @remarks
 * This presentation component creates the expected batch that the warehouse
 * operator scans later in the batch entry view. It validates the batch code
 * format, the quantity and the expiration date.
 */
@Component({
  selector: 'app-batch-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, MatIconModule, MatProgressSpinnerModule, MessageBanner],
  templateUrl: './batch-form.html',
  styleUrl: './batch-form.css',
})
export class BatchForm implements OnInit {
  /**
   * Store that manages inventory state.
   */
  protected readonly store = inject(InventoryStore);

  /**
   * Earliest selectable expiration date (today).
   */
  protected readonly today = new Date().toISOString().split('T')[0];

  /**
   * Reactive form used to capture the batch data.
   */
  protected readonly form = new FormGroup({
    productId: new FormControl<number | null>(null, [Validators.required]),
    zoneId: new FormControl<number | null>(null, [Validators.required]),
    batchNumber: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{4,30}$/)],
    }),
    initialQty: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)],
    }),
    expirationDate: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  /**
   * Lifecycle hook that loads the catalog.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Submits the batch form.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.store.registerBatch({
      productId: Number(value.productId),
      zoneId: Number(value.zoneId),
      batchNumber: value.batchNumber,
      initialQty: Number(value.initialQty),
      expirationDate: value.expirationDate,
    });
    this.form.reset({ batchNumber: '', initialQty: 0, expirationDate: '' });
  }
}
