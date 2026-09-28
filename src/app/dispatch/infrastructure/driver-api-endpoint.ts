import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Driver } from '../domain/model/driver.entity';
import { DriverResource, DriversResponse } from './driver-response';
import { DriverAssembler } from './driver-assembler';

const driverEndpointUrl = `${environment.serverBasePath}${environment.dispatchDriversEndpointPath}`;

/**
 * HTTP endpoint client for a vehicle driver.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class DriverApiEndpoint extends BaseApiEndpoint<
  Driver,
  DriverResource,
  DriversResponse,
  DriverAssembler
> {
  /**
   * Creates a new DriverApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, driverEndpointUrl, new DriverAssembler());
  }
}
