/**
 * Request payload for creating a delivery record.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateDeliveryRecordRequest {
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
}
