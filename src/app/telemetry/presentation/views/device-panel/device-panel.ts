import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TelemetryStore } from '../../../application/telemetry.store';
import { TelemetryDevice } from '../../../domain/model/telemetry-device.entity';
import { ConnectivityPolicy } from '../../../domain/model/connectivity-policy';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that renders the connectivity panel of the IoT devices.
 *
 * @remarks
 * This presentation component supports the connectivity panel and the
 * reconnection user stories. Devices without signal for more than 30 minutes
 * are highlighted as critical. A simulator lets the team send readings, drop
 * the signal and reconnect a device while the IoT gateway is not available.
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
   * Temperature typed for the next simulated reading.
   */
  protected readonly temperature = signal<number>(25);

  /**
   * Speed typed for the next simulated reading.
   */
  protected readonly speed = signal<number>(40);

  /**
   * Indicates whether the reconnection reports incomplete data.
   */
  protected readonly incompleteData = signal<boolean>(false);

  /**
   * Device currently selected in the table.
   */
  protected readonly selected = computed<TelemetryDevice | null>(
    () => this.store.devices().find((device) => device.id === this.selectedId()) ?? null,
  );

  /**
   * Lifecycle hook that loads the telemetry data.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Selects a device to inspect and simulate.
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
   * Sends a simulated reading from the selected device.
   */
  protected onSendReading(): void {
    const device = this.selected();
    if (!device) return;
    const last = this.store.streamsOf(device.id)[0];
    const jitter = () => (Math.random() - 0.5) * 0.004;
    this.store.sendReading({
      deviceId: device.id,
      latitude: Math.round(((last?.latitude ?? -12.0433) + jitter()) * 1e6) / 1e6,
      longitude: Math.round(((last?.longitude ?? -76.942) + jitter()) * 1e6) / 1e6,
      speed: Number(this.speed()),
      temperature: Number(this.temperature()),
    });
  }

  /**
   * Drops the signal of the selected device.
   */
  protected onDisconnect(): void {
    const device = this.selected();
    if (device) this.store.loseConnectivity({ deviceId: device.id });
  }

  /**
   * Restores the signal of the selected device.
   */
  protected onReconnect(): void {
    const device = this.selected();
    if (device) {
      this.store.restoreConnectivity({ deviceId: device.id, incompleteData: this.incompleteData() });
    }
  }
}
