import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InventoryStore } from '../../../application/inventory.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component that registers product waste and lists the waste history.
 *
 * @remarks
 * This presentation component supports the "register waste with reason" user
 * story. The quantity cannot exceed the stock of the selected batch and the
 * reason is mandatory. Accepted records reduce the batch stock.
 */
@Component({
  selector: 'app-waste-management',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MessageBanner,
  ],
  templateUrl: './waste-management.html',
  styleUrl: './waste-management.css',
})
export class WasteManagement implements OnInit {
  /**
   * Store that manages inventory state.
   */
  protected readonly store = inject(InventoryStore);

  /**
   * Store that exposes the signed in user.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * Columns displayed in the waste table.
   */
  protected readonly displayedColumns = ['reportedDate', 'batchNumber', 'quantity', 'reason', 'userName'];

  /**
   * Reactive form used to capture the waste data.
   */
  protected readonly form = new FormGroup({
    batchId: new FormControl<number | null>(null, [Validators.required]),
    quantity: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)],
    }),
    reason: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(255)],
    }),
  });

  /**
   * Lifecycle hook that loads the inventory.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Submits the waste form.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.store.registerWaste({
      batchId: Number(value.batchId),
      userId: this.iamStore.currentUserId() ?? 0,
      quantity: Number(value.quantity),
      reason: value.reason,
    });
    this.form.reset({ quantity: 0, reason: '' });
  }
}
