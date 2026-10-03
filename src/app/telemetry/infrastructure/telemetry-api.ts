import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';

import { DeviceModel } from '../domain/model/device-model.entity';
import { TelemetryDevice } from '../domain/model/telemetry-device.entity';
import { LocationStream } from '../domain/model/location-stream.entity';
import { DisconnectionPeriod } from '../domain/model/disconnection-period.entity';

import { DeviceModelApiEndpoint } from './device-model-api-endpoint';
import { TelemetryDeviceApiEndpoint } from './telemetry-device-api-endpoint';
import { LocationStreamApiEndpoint } from './location-stream-api-endpoint';
import { DisconnectionPeriodApiEndpoint } from './disconnection-period-api-endpoint';

import { CreateTelemetryDeviceRequest } from './telemetry-device.request';
import { CreateLocationStreamRequest } from './location-stream.request';
import { CreateDisconnectionPeriodRequest } from './disconnection-period.request';

/**
 * HTTP API facade for the Telemetry bounded context.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over device, model, reading and
 * disconnection endpoint clients. The IoT gateway is simulated by the mock
 * REST API until real hardware is connected.
 */
@Injectable({ providedIn: 'root' })
export class TelemetryApi extends BaseApi {
  /**
   * Endpoint client for device models.
   */
  private readonly modelEndpoint: DeviceModelApiEndpoint;

  /**
   * Endpoint client for devices.
   */
  private readonly deviceEndpoint: TelemetryDeviceApiEndpoint;

  /**
   * Endpoint client for telemetry readings.
   */
  private readonly streamEndpoint: LocationStreamApiEndpoint;

  /**
   * Endpoint client for disconnection periods.
   */
  private readonly disconnectionEndpoint: DisconnectionPeriodApiEndpoint;

  /**
   * Creates a new TelemetryApi facade.
   *
   * @param http - Angular HttpClient used by endpoint clients
   */
  constructor(http: HttpClient) {
    super();
    this.modelEndpoint = new DeviceModelApiEndpoint(http);
    this.deviceEndpoint = new TelemetryDeviceApiEndpoint(http);
    this.streamEndpoint = new LocationStreamApiEndpoint(http);
    this.disconnectionEndpoint = new DisconnectionPeriodApiEndpoint(http);
  }

  /**
   * Retrieves every device model.
   *
   * @returns Observable stream emitting DeviceModel entities
   */
  getModels(): Observable<DeviceModel[]> {
    return this.modelEndpoint.getAll();
  }

  /**
   * Retrieves every device.
   *
   * @returns Observable stream emitting TelemetryDevice entities
   */
  getDevices(): Observable<TelemetryDevice[]> {
    return this.deviceEndpoint.getAll();
  }

  /**
   * Retrieves the devices matching a hardware code.
   *
   * @param deviceCode - Hardware code of the device
   * @returns Observable stream emitting the matching TelemetryDevice entities
   */
  findDevicesByCode(deviceCode: string): Observable<TelemetryDevice[]> {
    return this.deviceEndpoint.getByQuery({ deviceCode });
  }

  /**
   * Creates a device.
   *
   * @param request - Device creation payload
   * @returns Observable stream emitting the created TelemetryDevice
   */
  createDevice(request: CreateTelemetryDeviceRequest): Observable<TelemetryDevice> {
    return this.deviceEndpoint.createFromRequest(request);
  }

  /**
   * Partially updates a device.
   *
   * @param id - Identifier of the device
   * @param changes - Fields to change
   * @returns Observable stream emitting the updated TelemetryDevice
   */
  updateDevice(
    id: number,
    changes: Partial<Pick<TelemetryDevice, 'connectionStatus' | 'lastSignalAt' | 'isActive'>>,
  ): Observable<TelemetryDevice> {
    return this.deviceEndpoint.patch(id, changes);
  }

  /**
   * Retrieves every telemetry reading.
   *
   * @returns Observable stream emitting LocationStream entities
   */
  getStreams(): Observable<LocationStream[]> {
    return this.streamEndpoint.getAll();
  }

  /**
   * Creates a telemetry reading.
   *
   * @param request - Reading creation payload
   * @returns Observable stream emitting the created LocationStream
   */
  createStream(request: CreateLocationStreamRequest): Observable<LocationStream> {
    return this.streamEndpoint.createFromRequest(request);
  }

  /**
   * Retrieves every disconnection period.
   *
   * @returns Observable stream emitting DisconnectionPeriod entities
   */
  getDisconnections(): Observable<DisconnectionPeriod[]> {
    return this.disconnectionEndpoint.getAll();
  }

  /**
   * Creates a disconnection period.
   *
   * @param request - Disconnection creation payload
   * @returns Observable stream emitting the created DisconnectionPeriod
   */
  createDisconnection(request: CreateDisconnectionPeriodRequest): Observable<DisconnectionPeriod> {
    return this.disconnectionEndpoint.createFromRequest(request);
  }

  /**
   * Closes a disconnection period when the signal is restored.
   *
   * @param id - Identifier of the disconnection period
   * @param endedAt - ISO 8601 timestamp of the reconnection
   * @param dataStatus - Availability of the telemetry of the period
   * @returns Observable stream emitting the updated DisconnectionPeriod
   */
  closeDisconnection(
    id: number,
    endedAt: string,
    dataStatus: 'AVAILABLE' | 'UNAVAILABLE',
  ): Observable<DisconnectionPeriod> {
    return this.disconnectionEndpoint.patch(id, { endedAt, dataStatus });
  }
}
