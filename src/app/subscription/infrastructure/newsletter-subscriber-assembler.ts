import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { NewsletterSubscriber } from '../domain/model/newsletter-subscriber.entity';
import { NewsletterSubscriberResource, NewsletterSubscribersResponse } from './newsletter-subscriber-response';

/**
 * Assembler for converting between NewsletterSubscriber domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class NewsletterSubscriberAssembler implements BaseAssembler<
  NewsletterSubscriber,
  NewsletterSubscriberResource,
  NewsletterSubscribersResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of NewsletterSubscriber domain entities
   */
  toEntitiesFromResponse(response: NewsletterSubscribersResponse): NewsletterSubscriber[] {
    return response.subscribers.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns NewsletterSubscriber domain entity
   */
  toEntityFromResource(resource: NewsletterSubscriberResource): NewsletterSubscriber {
    return new NewsletterSubscriber({
      id: resource.id,
      email: resource.email,
      subscribedAt: resource.subscribedAt,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - NewsletterSubscriber domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: NewsletterSubscriber): NewsletterSubscriberResource {
    return {
      id: entity.id,
      email: entity.email,
      subscribedAt: entity.subscribedAt,
    };
  }
}
