import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of a delivery record for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface DeliveryRecordResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the traceability log.
   */
  logId: number;

  /**
   * The person who received the delivery.
   */
  receivedBy: string;

  /**
   * The proof of delivery location.
   */
  signatureUrl: string | null;

  /**
   * The ISO 8601 timestamp of the delivery.
   */
  deliveredAt: string;

  /**
   * The delivery result.
   */
  status: 'DELIVERED' | 'REJECTED';

  /**
   * The rejection reason when the delivery was rejected.
   */
  rejectionReason: string | null;

  /**
   * Embedded log returned by the `_expand` query.
   */
  log?: { destinationName: string };
}

/**
 * Response envelope for a delivery record collection queries.
 */
export interface DeliveryRecordsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  records: DeliveryRecordResource[];
}
