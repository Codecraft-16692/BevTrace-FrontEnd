import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { SubscriptionPlan } from '../domain/model/subscription-plan.entity';
import { SubscriptionPlanResource, SubscriptionPlansResponse } from './subscription-plan-response';

/**
 * Assembler for converting between SubscriptionPlan domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class SubscriptionPlanAssembler implements BaseAssembler<
  SubscriptionPlan,
  SubscriptionPlanResource,
  SubscriptionPlansResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of SubscriptionPlan domain entities
   */
  toEntitiesFromResponse(response: SubscriptionPlansResponse): SubscriptionPlan[] {
    return response.plans.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns SubscriptionPlan domain entity
   */
  toEntityFromResource(resource: SubscriptionPlanResource): SubscriptionPlan {
    return new SubscriptionPlan({
      id: resource.id,
      code: resource.code,
      name: resource.name,
      descriptionKey: resource.descriptionKey,
      priceAmount: resource.priceAmount,
      currency: resource.currency,
      billingPeriod: resource.billingPeriod,
      maxRoutes: resource.maxRoutes,
      maxDevices: resource.maxDevices,
      maxUsers: resource.maxUsers,
      featureKeys: resource.featureKeys,
      highlighted: resource.highlighted,
      custom: resource.custom,
      active: resource.active,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - SubscriptionPlan domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: SubscriptionPlan): SubscriptionPlanResource {
    return {
      id: entity.id,
      code: entity.code,
      name: entity.name,
      descriptionKey: entity.descriptionKey,
      priceAmount: entity.priceAmount,
      currency: entity.currency,
      billingPeriod: entity.billingPeriod,
      maxRoutes: entity.maxRoutes,
      maxDevices: entity.maxDevices,
      maxUsers: entity.maxUsers,
      featureKeys: entity.featureKeys,
      highlighted: entity.highlighted,
      custom: entity.custom,
      active: entity.active,
    };
  }
}
