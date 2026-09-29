import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { TransportVehicle } from '../domain/model/transport-vehicle.entity';
import { TransportVehicleResource, TransportVehiclesResponse } from './transport-vehicle-response';
import { TransportVehicleAssembler } from './transport-vehicle-assembler';

const transportVehicleEndpointUrl = `${environment.serverBasePath}${environment.dispatchVehiclesEndpointPath}`;

/**
 * HTTP endpoint client for a transport vehicle.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class TransportVehicleApiEndpoint extends BaseApiEndpoint<
  TransportVehicle,
  TransportVehicleResource,
  TransportVehiclesResponse,
  TransportVehicleAssembler
> {
  /**
   * Creates a new TransportVehicleApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, transportVehicleEndpointUrl, new TransportVehicleAssembler());
    this.expansions = ['driver'];
  }
}
