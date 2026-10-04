import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { IncidentRecord } from '../domain/model/incident-record.entity';
import { IncidentRecordResource, IncidentRecordsResponse } from './incident-record-response';

/**
 * Assembler for converting between IncidentRecord domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class IncidentRecordAssembler implements BaseAssembler<
  IncidentRecord,
  IncidentRecordResource,
  IncidentRecordsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of IncidentRecord domain entities
   */
  toEntitiesFromResponse(response: IncidentRecordsResponse): IncidentRecord[] {
    return response.incidents.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns IncidentRecord domain entity
   */
  toEntityFromResource(resource: IncidentRecordResource): IncidentRecord {
    return new IncidentRecord({
      id: resource.id,
      logId: resource.logId,
      ruleId: resource.ruleId,
      anomalyType: resource.anomalyType,
      severity: resource.severity,
      status: resource.status,
      detectedAt: resource.detectedAt,
      description: resource.description,
      acknowledgedBy: resource.acknowledgedBy,
      acknowledgedAt: resource.acknowledgedAt,
      resolvedAt: resource.resolvedAt,
      reopenCount: resource.reopenCount,
      destinationName: resource.log?.destinationName ?? '',
      vehiclePlate: resource.log?.vehiclePlate ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - IncidentRecord domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: IncidentRecord): IncidentRecordResource {
    return {
      id: entity.id,
      logId: entity.logId,
      ruleId: entity.ruleId,
      anomalyType: entity.anomalyType,
      severity: entity.severity,
      status: entity.status,
      detectedAt: entity.detectedAt,
      description: entity.description,
      acknowledgedBy: entity.acknowledgedBy,
      acknowledgedAt: entity.acknowledgedAt,
      resolvedAt: entity.resolvedAt,
      reopenCount: entity.reopenCount,
    };
  }
}
