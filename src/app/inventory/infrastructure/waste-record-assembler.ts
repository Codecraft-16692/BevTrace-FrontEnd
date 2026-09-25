import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { WasteRecord } from '../domain/model/waste-record.entity';
import { WasteRecordResource, WasteRecordsResponse } from './waste-record-response';

/**
 * Assembler for converting between WasteRecord domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class WasteRecordAssembler implements BaseAssembler<
  WasteRecord,
  WasteRecordResource,
  WasteRecordsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of WasteRecord domain entities
   */
  toEntitiesFromResponse(response: WasteRecordsResponse): WasteRecord[] {
    return response.wasteRecords.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns WasteRecord domain entity
   */
  toEntityFromResource(resource: WasteRecordResource): WasteRecord {
    return new WasteRecord({
      id: resource.id,
      batchId: resource.batchId,
      userId: resource.userId,
      quantity: resource.quantity,
      reason: resource.reason,
      reportedDate: resource.reportedDate,
      batchNumber: resource.batch?.batchNumber ?? '',
      userName: resource.user?.name ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - WasteRecord domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: WasteRecord): WasteRecordResource {
    return {
      id: entity.id,
      batchId: entity.batchId,
      userId: entity.userId,
      quantity: entity.quantity,
      reason: entity.reason,
      reportedDate: entity.reportedDate,
    };
  }
}
