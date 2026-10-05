import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { defer, forkJoin, Observable, of, switchMap, throwError } from 'rxjs';

import { BaseStore } from '../../shared/application/base-store';
import { BusinessError } from '../../shared/domain/model/business-error';

import { DeviceModel } from '../domain/model/device-model.entity';
import { TelemetryDevice } from '../domain/model/telemetry-device.entity';
import { LocationStream } from '../domain/model/location-stream.entity';
import { DisconnectionPeriod } from '../domain/model/disconnection-period.entity';
import { ConnectivityPolicy } from '../domain/model/connectivity-policy';
import { ProvisionDeviceCommand } from '../domain/model/provision-device.command';
import { SendTelemetryReadingCommand } from '../domain/model/send-telemetry-reading.command';
import { LoseConnectivityCommand } from '../domain/model/lose-connectivity.command';
import { RestoreConnectivityCommand } from '../domain/model/restore-connectivity.command';

import { TelemetryApi } from '../infrastructure/telemetry-api';
import { DispatchApi } from '../../dispatch/infrastructure/dispatch-api';
import { TransportVehicle } from '../../dispatch/domain/model/transport-vehicle.entity';
import { IncidentStore } from '../../incident/application/incident.store';

/**
 * Signal-based application store for the Telemetry bounded context.
 *
 * @remarks
 * This store manages the IoT devices, their connectivity status (critical
 * after 30 minutes without signal), the telemetry readings and the
 * disconnection history. The IoT gateway is simulated: readings, signal loss
 * and reconnection are triggered from the presentation layer.
 */
@Injectable({ providedIn: 'root' })
export class TelemetryStore extends BaseStore {
  /**
   * API facade used to reach the telemetry endpoints.
   */
  private readonly api = inject(TelemetryApi);

  /**
   * API facade used to read vehicles from the dispatch context.
   */
  private readonly dispatchApi = inject(DispatchApi);

  /**
   * Injector used to reach other bounded contexts lazily.
   */
  private readonly injector = inject(Injector);

  /**
   * Internal signal containing the device models.
   */
  private readonly modelsSignal = signal<DeviceModel[]>([]);

  /**
   * Internal signal containing the devices.
   */
  private readonly devicesSignal = signal<TelemetryDevice[]>([]);

  /**
   * Internal signal containing the telemetry readings.
   */
  private readonly streamsSignal = signal<LocationStream[]>([]);

  /**
   * Internal signal containing the disconnection periods.
   */
  private readonly disconnectionsSignal = signal<DisconnectionPeriod[]>([]);

  /**
   * Internal signal containing the vehicles of the fleet.
   */
  private readonly vehiclesSignal = signal<TransportVehicle[]>([]);

  /**
   * Readonly signal exposing the device models.
   */
  readonly models = this.modelsSignal.asReadonly();

  /**
   * Readonly signal exposing the devices.
   */
  readonly devices = this.devicesSignal.asReadonly();

  /**
   * Readonly signal exposing the vehicles of the fleet.
   */
  readonly vehicles = this.vehiclesSignal.asReadonly();

  /**
   * Readonly signal exposing the readings, newest first.
   */
  readonly streams = computed(() =>
    [...this.streamsSignal()].sort((a, b) => b.timestamp.localeCompare(a.timestamp)),
  );

  /**
   * Readonly signal exposing the disconnection periods, newest first.
   */
  readonly disconnections = computed(() =>
    [...this.disconnectionsSignal()].sort((a, b) => b.startedAt.localeCompare(a.startedAt)),
  );

  /**
   * Number of devices with an active connection.
   */
  readonly connectedCount = computed(
    () => this.devicesSignal().filter((device) => device.connectionStatus === 'CONNECTED').length,
  );

  /**
   * Number of disconnected devices.
   */
  readonly disconnectedCount = computed(
    () => this.devicesSignal().filter((device) => device.connectionStatus === 'DISCONNECTED').length,
  );

  /**
   * Number of devices whose connectivity is critical.
   */
  readonly criticalCount = computed(
    () => this.devicesSignal().filter((device) => ConnectivityPolicy.isCritical(device)).length,
  );

  /**
   * Vehicles that do not have a device installed yet.
   */
  readonly vehiclesWithoutDevice = computed(() => {
    const equipped = new Set(this.devicesSignal().map((device) => device.vehicleId));
    return this.vehiclesSignal().filter((vehicle) => !equipped.has(vehicle.id));
  });

  /**
   * Loads every telemetry collection.
   */
  loadAll(): void {
    this.read(
      forkJoin({
        models: this.api.getModels(),
        devices: this.api.getDevices(),
        streams: this.api.getStreams(),
        disconnections: this.api.getDisconnections(),
        vehicles: this.dispatchApi.getVehicles(),
      }),
      'telemetry.errors.load',
      (result) => {
        this.modelsSignal.set(result.models);
        this.devicesSignal.set(result.devices);
        this.streamsSignal.set(result.streams);
        this.disconnectionsSignal.set(result.disconnections);
        this.vehiclesSignal.set(result.vehicles);
      },
    );
  }

  /**
   * Returns the readings of a device, newest first.
   *
   * @param deviceId - Identifier of the device
   * @returns Readings emitted by the device
   */
  streamsOf(deviceId: number): LocationStream[] {
    return this.streams().filter((stream) => stream.deviceId === deviceId);
  }

  /**
   * Returns the disconnection history of a device, newest first.
   *
   * @param deviceId - Identifier of the device
   * @returns Disconnection periods of the device
   */
  disconnectionsOf(deviceId: number): DisconnectionPeriod[] {
    return this.disconnections().filter((period) => period.deviceId === deviceId);
  }

  /**
   * Provisions a new device in a vehicle.
   *
   * @param command - Command containing the device data
   */
  provisionDevice(command: ProvisionDeviceCommand): void {
    const deviceCode = command.deviceCode.trim().toUpperCase();

    const operation = this.api.findDevicesByCode(deviceCode).pipe(
      switchMap((existing) => {
        if (existing.length > 0) {
          return throwError(() => new BusinessError('telemetry.errors.duplicated-code', { code: deviceCode }));
        }
        if (this.devicesSignal().some((device) => device.vehicleId === command.vehicleId)) {
          return throwError(() => new BusinessError('telemetry.errors.vehicle-has-device'));
        }
        return this.api.createDevice({
          vehicleId: command.vehicleId,
          modelId: command.modelId,
          deviceCode,
          installedAt: new Date().toISOString(),
          isActive: true,
          connectionStatus: 'CONNECTED',
          lastSignalAt: new Date().toISOString(),
        });
      }),
    );

    this.write(operation, 'telemetry.errors.generic', () => this.refresh(), {
      key: 'telemetry.form.success',
      params: { code: deviceCode },
    });
  }

  /**
   * Ingests a telemetry reading emitted by a connected device.
   *
   * @param command - Command containing the reading
   */
  sendReading(command: SendTelemetryReadingCommand): void {
    const operation = defer(() => {
      const device = this.devicesSignal().find((item) => item.id === command.deviceId);
      if (!device || device.connectionStatus !== 'CONNECTED') {
        return throwError(() => new BusinessError('telemetry.errors.device-disconnected'));
      }
      const timestamp = new Date().toISOString();
      return this.api
        .createStream({
          deviceId: device.id,
          latitude: command.latitude,
          longitude: command.longitude,
          speed: command.speed,
          temperature: command.temperature,
          timestamp,
        })
        .pipe(switchMap(() => this.api.updateDevice(device.id, { lastSignalAt: timestamp })));
    });

    this.write(operation, 'telemetry.errors.generic', () => this.refresh(), {
      key: 'telemetry.panel.reading-sent',
    });
  }

  /**
   * Marks a device as disconnected and opens a disconnection period.
   *
   * @param command - Command containing the device
   */
  loseConnectivity(command: LoseConnectivityCommand): void {
    const operation = defer(() => {
      const device = this.devicesSignal().find((item) => item.id === command.deviceId);
      if (!device || device.connectionStatus === 'DISCONNECTED') {
        return throwError(() => new BusinessError('telemetry.errors.already-disconnected'));
      }
      return this.api.updateDevice(device.id, { connectionStatus: 'DISCONNECTED' }).pipe(
        switchMap(() =>
          this.api.createDisconnection({
            deviceId: device.id,
            startedAt: new Date().toISOString(),
            endedAt: null,
            dataStatus: 'AVAILABLE',
          }),
        ),
      );
    });

    this.write(operation, 'telemetry.errors.generic', () => this.refresh(), {
      key: 'telemetry.panel.disconnected',
    });
  }

  /**
   * Marks a device as reconnected, closes the disconnection period and notifies the team.
   *
   * @param command - Command containing the device and the completeness of its data
   */
  restoreConnectivity(command: RestoreConnectivityCommand): void {
    const operation = defer(() => {
      const device = this.devicesSignal().find((item) => item.id === command.deviceId);
      if (!device || device.connectionStatus === 'CONNECTED') {
        return throwError(() => new BusinessError('telemetry.errors.already-connected'));
      }
      const now = new Date().toISOString();
      const openPeriod = this.disconnectionsSignal().find(
        (period) => period.deviceId === device.id && period.endedAt === null,
      );
      const closePeriod: Observable<unknown> = openPeriod
        ? this.api.closeDisconnection(openPeriod.id, now, command.incompleteData ? 'UNAVAILABLE' : 'AVAILABLE')
        : of(null);

      return this.api
        .updateDevice(device.id, { connectionStatus: 'CONNECTED', lastSignalAt: now })
        .pipe(switchMap((updated) => closePeriod.pipe(switchMap(() => of(updated)))));
    });

    this.write(
      operation,
      'telemetry.errors.generic',
      (device) => {
        const suffix = command.incompleteData
          ? 'Some telemetry of the disconnected period is unavailable.'
          : 'Telemetry of the period is complete.';
        const incidents = this.injector.get(IncidentStore);
        ['ROLE_WAREHOUSE_OPERATOR', 'ROLE_LOGISTICS_MANAGER'].forEach((role) =>
          incidents.notify({
            recipientRole: role,
            type: 'TELEMETRY',
            title: 'Device reconnected',
            message: `Device ${device.deviceCode} is connected again. ${suffix}`,
          }),
        );
        this.refresh();
      },
      { key: 'telemetry.panel.reconnected' },
    );
  }

  /**
   * Reloads the telemetry data silently after a write operation.
   */
  private refresh(): void {
    forkJoin({
      devices: this.api.getDevices(),
      streams: this.api.getStreams(),
      disconnections: this.api.getDisconnections(),
    }).subscribe((result) => {
      this.devicesSignal.set(result.devices);
      this.streamsSignal.set(result.streams);
      this.disconnectionsSignal.set(result.disconnections);
    });
  }
}
