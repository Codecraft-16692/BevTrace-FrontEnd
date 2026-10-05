import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Payment } from '../domain/model/payment.entity';
import { PaymentResource, PaymentsResponse } from './payment-response';
import { PaymentAssembler } from './payment-assembler';

const paymentEndpointUrl = `${environment.serverBasePath}${environment.subscriptionPaymentsEndpointPath}`;

/**
 * HTTP endpoint client for a subscription payment.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class PaymentApiEndpoint extends BaseApiEndpoint<
  Payment,
  PaymentResource,
  PaymentsResponse,
  PaymentAssembler
> {
  /**
   * Creates a new PaymentApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, paymentEndpointUrl, new PaymentAssembler());
  }
}
