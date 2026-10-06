import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Subscription } from '../domain/model/subscription.entity';
import { SubscriptionResource, SubscriptionsResponse } from './subscription-response';

/**
 * Assembler for converting between Subscription domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class SubscriptionAssembler implements BaseAssembler<
  Subscription,
  SubscriptionResource,
  SubscriptionsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of Subscription domain entities
   */
  toEntitiesFromResponse(response: SubscriptionsResponse): Subscription[] {
    return response.subscriptions.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns Subscription domain entity
   */
  toEntityFromResource(resource: SubscriptionResource): Subscription {
    return new Subscription({
      id: resource.id,
      userId: resource.userId,
      companyName: resource.companyName,
      planCode: resource.planCode,
      billingCycle: resource.billingCycle,
      status: resource.status,
      currentPeriodStart: resource.currentPeriodStart,
      currentPeriodEnd: resource.currentPeriodEnd,
      cancelledAt: resource.cancelledAt,
      userName: resource.user?.name ?? '',
      userEmail: resource.user?.email ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - Subscription domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: Subscription): SubscriptionResource {
    return {
      id: entity.id,
      userId: entity.userId,
      companyName: entity.companyName,
      planCode: entity.planCode,
      billingCycle: entity.billingCycle,
      status: entity.status,
      currentPeriodStart: entity.currentPeriodStart,
      currentPeriodEnd: entity.currentPeriodEnd,
      cancelledAt: entity.cancelledAt,
    };
  }
}
