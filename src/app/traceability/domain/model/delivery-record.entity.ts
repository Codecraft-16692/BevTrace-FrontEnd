import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a delivery record within the traceability domain.
 *
 * @remarks
 * In Domain-Driven Design, DeliveryRecord is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the traceability bounded context.
 */
export class DeliveryRecord implements BaseEntity {
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
   * The name of the destination client.
   */
  destinationName: string;

  /**
   * Creates a new DeliveryRecord entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    logId: number;
    receivedBy: string;
    signatureUrl: string | null;
    deliveredAt: string;
    status: 'DELIVERED' | 'REJECTED';
    rejectionReason: string | null;
    destinationName: string;
  }) {
    this.id = params.id;
    this.logId = params.logId;
    this.receivedBy = params.receivedBy;
    this.signatureUrl = params.signatureUrl;
    this.deliveredAt = params.deliveredAt;
    this.status = params.status;
    this.rejectionReason = params.rejectionReason;
    this.destinationName = params.destinationName;
  }
}
