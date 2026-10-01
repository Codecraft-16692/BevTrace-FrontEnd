import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { AlertRule } from '../domain/model/alert-rule.entity';
import { AlertRuleResource, AlertRulesResponse } from './alert-rule-response';

/**
 * Assembler for converting between AlertRule domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class AlertRuleAssembler implements BaseAssembler<
  AlertRule,
  AlertRuleResource,
  AlertRulesResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of AlertRule domain entities
   */
  toEntitiesFromResponse(response: AlertRulesResponse): AlertRule[] {
    return response.rules.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns AlertRule domain entity
   */
  toEntityFromResource(resource: AlertRuleResource): AlertRule {
    return new AlertRule({
      id: resource.id,
      conditionType: resource.conditionType,
      threshold: resource.threshold,
      severity: resource.severity,
      description: resource.description,
      active: resource.active,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - AlertRule domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: AlertRule): AlertRuleResource {
    return {
      id: entity.id,
      conditionType: entity.conditionType,
      threshold: entity.threshold,
      severity: entity.severity,
      description: entity.description,
      active: entity.active,
    };
  }
}
