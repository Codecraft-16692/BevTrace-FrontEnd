import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a transport vehicle within the dispatch domain.
 *
 * @remarks
 * In Domain-Driven Design, TransportVehicle is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the dispatch bounded context.
 */
export class TransportVehicle implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the assigned driver.
   */
  driverId: number;

  /**
   * The vehicle plate number.
   */
  plateNumber: string;

  /**
   * The maximum load capacity in kilograms.
   */
  maxCapacity: number;

  /**
   * Indicates whether the vehicle can be assigned to a dispatch.
   */
  isAvailable: boolean;

  /**
   * The name of the assigned driver.
   */
  driverName: string;

  /**
   * Creates a new TransportVehicle entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    driverId: number;
    plateNumber: string;
    maxCapacity: number;
    isAvailable: boolean;
    driverName: string;
  }) {
    this.id = params.id;
    this.driverId = params.driverId;
    this.plateNumber = params.plateNumber;
    this.maxCapacity = params.maxCapacity;
    this.isAvailable = params.isAvailable;
    this.driverName = params.driverName;
  }
}
