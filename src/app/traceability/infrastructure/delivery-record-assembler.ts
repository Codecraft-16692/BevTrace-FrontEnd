import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { DeliveryRecord } from '../domain/model/delivery-record.entity';
import { DeliveryRecordResource, DeliveryRecordsResponse } from './delivery-record-response';

/**
 * Assembler for converting between DeliveryRecord domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class DeliveryRecordAssembler implements BaseAssembler<
  DeliveryRecord,
  DeliveryRecordResource,
  DeliveryRecordsResponse
> {

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns DeliveryRecord domain entity
   */
  toEntityFromResource(resource: DeliveryRecordResource): DeliveryRecord {
    return new DeliveryRecord({
      id: resource.id,
      logId: resource.logId,
      receivedBy: resource.receivedBy,
      signatureUrl: resource.signatureUrl,
      deliveredAt: resource.deliveredAt,
      status: resource.status,
      rejectionReason: resource.rejectionReason,
      destinationName: resource.log?.destinationName ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - DeliveryRecord domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: DeliveryRecord): DeliveryRecordResource {
    return {
      id: entity.id,
      logId: entity.logId,
      receivedBy: entity.receivedBy,
      signatureUrl: entity.signatureUrl,
      deliveredAt: entity.deliveredAt,
      status: entity.status,
      rejectionReason: entity.rejectionReason,
    };
  }
}
