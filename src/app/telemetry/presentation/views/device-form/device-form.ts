import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { TelemetryStore } from '../../../application/telemetry.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component that provisions a new IoT device in a vehicle.
 *
 * @remarks
 * This presentation component validates the hardware code, the vehicle and the
 * device model. The store rejects duplicated codes and vehicles that already
 * have a device installed.
 */
@Component({
  selector: 'app-device-form',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule, MatIconModule, MessageBanner],
  templateUrl: './device-form.html',
  styleUrl: './device-form.css',
})
export class DeviceForm implements OnInit {
  /**
   * Store that manages telemetry state.
   */
  protected readonly store = inject(TelemetryStore);

  /**
   * Reactive form used to capture the device data.
   */
  protected readonly form = new FormGroup({
    deviceCode: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^[A-Za-z0-9-]{4,20}$/)],
    }),
    vehicleId: new FormControl<number | null>(null, [Validators.required]),
    modelId: new FormControl<number | null>(null, [Validators.required]),
  });

  /**
   * Lifecycle hook that loads vehicles, models and devices.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Submits the device form.
   */
  protected onSubmit(): void {
    const value = this.form.getRawValue();
    this.store.provisionDevice({
      deviceCode: value.deviceCode,
      vehicleId: Number(value.vehicleId),
      modelId: Number(value.modelId),
    });
    this.form.reset({ deviceCode: '' });
  }
}
