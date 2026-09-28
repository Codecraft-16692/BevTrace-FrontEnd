import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a delivery destination within the dispatch domain.
 *
 * @remarks
 * In Domain-Driven Design, DeliveryDestination is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the dispatch bounded context.
 */
export class DeliveryDestination implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The client name.
   */
  clientName: string;

  /**
   * The delivery address.
   */
  address: string;

  /**
   * The destination latitude.
   */
  latitude: number;

  /**
   * The destination longitude.
   */
  longitude: number;

  /**
   * The commercial region of the destination.
   */
  region: string;

  /**
   * Creates a new DeliveryDestination entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    clientName: string;
    address: string;
    latitude: number;
    longitude: number;
    region: string;
  }) {
    this.id = params.id;
    this.clientName = params.clientName;
    this.address = params.address;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
    this.region = params.region;
  }
}
