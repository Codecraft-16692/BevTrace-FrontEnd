import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { NewsletterSubscriber } from '../domain/model/newsletter-subscriber.entity';
import { NewsletterSubscriberResource, NewsletterSubscribersResponse } from './newsletter-subscriber-response';
import { NewsletterSubscriberAssembler } from './newsletter-subscriber-assembler';

const newsletterSubscriberEndpointUrl = `${environment.serverBasePath}${environment.subscriptionNewsletterEndpointPath}`;

/**
 * HTTP endpoint client for a newsletter subscriber.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class NewsletterSubscriberApiEndpoint extends BaseApiEndpoint<
  NewsletterSubscriber,
  NewsletterSubscriberResource,
  NewsletterSubscribersResponse,
  NewsletterSubscriberAssembler
> {
  /**
   * Creates a new NewsletterSubscriberApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, newsletterSubscriberEndpointUrl, new NewsletterSubscriberAssembler());
  }
}
