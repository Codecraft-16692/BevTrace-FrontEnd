import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { TelemetryDevice } from '../domain/model/telemetry-device.entity';
import { TelemetryDeviceResource, TelemetryDevicesResponse } from './telemetry-device-response';
import { TelemetryDeviceAssembler } from './telemetry-device-assembler';

const telemetryDeviceEndpointUrl = `${environment.serverBasePath}${environment.telemetryDevicesEndpointPath}`;

/**
 * HTTP endpoint client for an IoT telemetry device.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class TelemetryDeviceApiEndpoint extends BaseApiEndpoint<
  TelemetryDevice,
  TelemetryDeviceResource,
  TelemetryDevicesResponse,
  TelemetryDeviceAssembler
> {
  /**
   * Creates a new TelemetryDeviceApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, telemetryDeviceEndpointUrl, new TelemetryDeviceAssembler());
    this.expansions = ['vehicle', 'model'];
  }
}
