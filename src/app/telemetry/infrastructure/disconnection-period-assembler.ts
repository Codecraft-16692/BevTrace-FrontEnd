import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DisconnectionPeriod } from '../domain/model/disconnection-period.entity';
import { DisconnectionPeriodResource, DisconnectionPeriodsResponse } from './disconnection-period-response';

/**
 * Assembler for converting between DisconnectionPeriod domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class DisconnectionPeriodAssembler implements BaseAssembler<
  DisconnectionPeriod,
  DisconnectionPeriodResource,
  DisconnectionPeriodsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of DisconnectionPeriod domain entities
   */
  toEntitiesFromResponse(response: DisconnectionPeriodsResponse): DisconnectionPeriod[] {
    return response.periods.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns DisconnectionPeriod domain entity
   */
  toEntityFromResource(resource: DisconnectionPeriodResource): DisconnectionPeriod {
    return new DisconnectionPeriod({
      id: resource.id,
      deviceId: resource.deviceId,
      startedAt: resource.startedAt,
      endedAt: resource.endedAt,
      dataStatus: resource.dataStatus,
      deviceCode: resource.device?.deviceCode ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - DisconnectionPeriod domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: DisconnectionPeriod): DisconnectionPeriodResource {
    return {
      id: entity.id,
      deviceId: entity.deviceId,
      startedAt: entity.startedAt,
      endedAt: entity.endedAt,
      dataStatus: entity.dataStatus,
    };
  }
}
