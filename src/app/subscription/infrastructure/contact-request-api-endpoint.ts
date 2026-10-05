import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { ContactRequest } from '../domain/model/contact-request.entity';
import { ContactRequestResource, ContactRequestsResponse } from './contact-request-response';
import { ContactRequestAssembler } from './contact-request-assembler';

const contactRequestEndpointUrl = `${environment.serverBasePath}${environment.subscriptionContactsEndpointPath}`;

/**
 * HTTP endpoint client for a commercial contact request.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class ContactRequestApiEndpoint extends BaseApiEndpoint<
  ContactRequest,
  ContactRequestResource,
  ContactRequestsResponse,
  ContactRequestAssembler
> {
  /**
   * Creates a new ContactRequestApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, contactRequestEndpointUrl, new ContactRequestAssembler());
  }
}
