import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { InventoryStore } from '../../../application/inventory.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component that adds a product to the catalogue.
 *
 * @remarks
 * Reserved to logistics managers. The products are entered by hand: the stock of a product
 * only appears when its batches are registered and received.
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, MatIconModule, MessageBanner],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  /**
   * Store that manages inventory state.
   */
  protected readonly store = inject(InventoryStore);

  /**
   * Reactive form used to capture the product data.
   */
  protected readonly form = new FormGroup({
    skuCode: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{3,30}$/)],
    }),
    name: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    category: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    volumeMl: new FormControl<number>(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1), Validators.pattern(/^[0-9]+$/)],
    }),
    packagingType: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
  });

  /**
   * Lifecycle hook that clears the messages of a previous view.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Submits the product form.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.store.registerProduct({ ...value, volumeMl: Number(value.volumeMl) });
    this.form.reset({ skuCode: '', name: '', category: '', volumeMl: 0, packagingType: '' });
  }
}
