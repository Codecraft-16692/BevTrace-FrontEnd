import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InventoryStore } from '../../../application/inventory.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component that registers the entry of a product batch by scanning its code.
 *
 * @remarks
 * This presentation component supports the "register batch entry" user story.
 * The operator types or scans the batch code; the store validates it against
 * the batches announced by the plant and rejects unknown or duplicated codes.
 */
@Component({
  selector: 'app-batch-entry',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, MatIconModule, MatProgressSpinnerModule, MessageBanner],
  templateUrl: './batch-entry.html',
  styleUrl: './batch-entry.css',
})
export class BatchEntry implements OnInit {
  /**
   * Store that manages inventory state.
   */
  protected readonly store = inject(InventoryStore);

  /**
   * Store that exposes the signed in operator.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * Reactive form used to capture the scanned code.
   */
  protected readonly form = new FormGroup({
    scanCode: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{4,30}$/)],
    }),
  });

  /**
   * Lifecycle hook that loads the batches waiting for entry.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Submits the scanned code.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.store.receiveBatch({
      scanCode: this.form.controls.scanCode.value,
      userId: this.iamStore.currentUserId() ?? 0,
    });
    this.form.reset({ scanCode: '' });
  }

  /**
   * Fills the form with the code of an expected batch, as a scanner would do.
   *
   * @param code - Batch code to load in the input
   */
  protected useCode(code: string): void {
    this.form.controls.scanCode.setValue(code);
  }
}
