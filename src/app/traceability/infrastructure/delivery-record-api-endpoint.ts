import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { DeliveryRecord } from '../domain/model/delivery-record.entity';
import { DeliveryRecordResource, DeliveryRecordsResponse } from './delivery-record-response';
import { DeliveryRecordAssembler } from './delivery-record-assembler';

const deliveryRecordEndpointUrl = `${environment.serverBasePath}${environment.traceabilityDeliveryRecordsEndpointPath}`;

/**
 * HTTP endpoint client for a delivery record.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class DeliveryRecordApiEndpoint extends BaseApiEndpoint<
  DeliveryRecord,
  DeliveryRecordResource,
  DeliveryRecordsResponse,
  DeliveryRecordAssembler
> {
  /**
   * Creates a new DeliveryRecordApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, deliveryRecordEndpointUrl, new DeliveryRecordAssembler());
    this.expansions = ['log'];
  }
}
