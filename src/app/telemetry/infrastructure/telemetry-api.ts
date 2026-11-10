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

import { ProvisionDeviceRequest } from './telemetry-device.request';

/**
 * HTTP API facade for the Telemetry bounded context.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over device, model, reading and
 * disconnection endpoint clients. Telemetry is produced by the IoT gateway and
 * persisted by the REST API; the frontend only reads it.
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
   * Provisions a device (POST /devices).
   *
   * @param request - Vehicle, model and device code
   * @returns Observable emitting the provisioned device
   */
  provisionDevice(request: ProvisionDeviceRequest): Observable<TelemetryDevice> {
    return this.deviceEndpoint.createFromRequest(request);
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
   * Retrieves every disconnection period.
   *
   * @returns Observable stream emitting DisconnectionPeriod entities
   */
  getDisconnections(): Observable<DisconnectionPeriod[]> {
    return this.disconnectionEndpoint.getAll();
  }


}
