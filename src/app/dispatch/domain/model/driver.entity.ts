import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a vehicle driver within the dispatch domain.
 *
 * @remarks
 * In Domain-Driven Design, Driver is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the dispatch bounded context.
 */
export class Driver implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The full name of the driver.
   */
  fullName: string;

  /**
   * The driving license number.
   */
  licenseNumber: string;

  /**
   * The driver availability status.
   */
  status: 'ACTIVE' | 'ON_LEAVE';

  /**
   * Creates a new Driver entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    fullName: string;
    licenseNumber: string;
    status: 'ACTIVE' | 'ON_LEAVE';
  }) {
    this.id = params.id;
    this.fullName = params.fullName;
    this.licenseNumber = params.licenseNumber;
    this.status = params.status;
  }
}
