import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { DeviceModel } from '../domain/model/device-model.entity';
import { DeviceModelResource, DeviceModelsResponse } from './device-model-response';
import { DeviceModelAssembler } from './device-model-assembler';

const deviceModelEndpointUrl = `${environment.serverBasePath}${environment.telemetryModelsEndpointPath}`;

/**
 * HTTP endpoint client for an IoT device model.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class DeviceModelApiEndpoint extends BaseApiEndpoint<
  DeviceModel,
  DeviceModelResource,
  DeviceModelsResponse,
  DeviceModelAssembler
> {
  /**
   * Creates a new DeviceModelApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, deviceModelEndpointUrl, new DeviceModelAssembler());
  }
}
