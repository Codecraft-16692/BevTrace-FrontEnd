import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { DeliveryDestination } from '../domain/model/delivery-destination.entity';
import { DeliveryDestinationResource, DeliveryDestinationsResponse } from './delivery-destination-response';
import { DeliveryDestinationAssembler } from './delivery-destination-assembler';

const deliveryDestinationEndpointUrl = `${environment.serverBasePath}${environment.dispatchDestinationsEndpointPath}`;

/**
 * HTTP endpoint client for a delivery destination.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class DeliveryDestinationApiEndpoint extends BaseApiEndpoint<
  DeliveryDestination,
  DeliveryDestinationResource,
  DeliveryDestinationsResponse,
  DeliveryDestinationAssembler
> {
  /**
   * Creates a new DeliveryDestinationApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, deliveryDestinationEndpointUrl, new DeliveryDestinationAssembler());
  }
}
