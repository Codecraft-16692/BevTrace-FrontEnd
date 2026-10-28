import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TelemetryStore } from '../../../application/telemetry.store';
import { TelemetryDevice } from '../../../domain/model/telemetry-device.entity';
import { ConnectivityPolicy } from '../../../domain/model/connectivity-policy';
import { autoRefresh } from '../../../../shared/application/auto-refresh';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that renders the connectivity panel of the IoT devices.
 *
 * @remarks
 * This presentation component supports the connectivity panel user story. Devices without signal for more than 30 minutes
 * are highlighted as critical. The view is read-only: connection status,
 * readings and disconnection periods come from the backend and are reloaded
 * periodically or on demand.
 */
@Component({
  selector: 'app-device-panel',
  standalone: true,
  imports: [
    DatePipe,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MessageBanner,
    StatusChip,
  ],
  templateUrl: './device-panel.html',
  styleUrl: './device-panel.css',
})
export class DevicePanel implements OnInit {
  /**
   * Store that manages telemetry state.
   */
  protected readonly store = inject(TelemetryStore);

  /**
   * Columns displayed in the device table.
   */
  protected readonly displayedColumns = ['deviceCode', 'vehicle', 'model', 'connection', 'lastSignal', 'actions'];

  /**
   * Identifier of the selected device.
   */
  protected readonly selectedId = signal<number | null>(null);

  /**
   * Device currently selected in the table.
   */
  protected readonly selected = computed<TelemetryDevice | null>(
    () => this.store.devices().find((device) => device.id === this.selectedId()) ?? null,
  );

  /**
   * Keeps the panel up to date by reloading the data periodically.
   */
  constructor() {
    autoRefresh(() => this.store.reload());
  }

  /**
   * Lifecycle hook that loads the telemetry data.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Selects a device to inspect.
   *
   * @param device - Device selected in the table
   */
  protected select(device: TelemetryDevice): void {
    this.selectedId.set(device.id);
  }

  /**
   * Calculates the minutes without signal of a device.
   *
   * @param device - Device to evaluate
   * @returns Whole minutes since the last signal
   */
  protected minutes(device: TelemetryDevice): number {
    return ConnectivityPolicy.minutesWithoutSignal(device);
  }

  /**
   * Determines whether the connectivity of a device is critical.
   *
   * @param device - Device to evaluate
   * @returns True when the device is critical
   */
  protected isCritical(device: TelemetryDevice): boolean {
    return ConnectivityPolicy.isCritical(device);
  }

  /**
   * Reloads the telemetry data from the API.
   */
  protected onRefresh(): void {
    this.store.loadAll();
  }
}
