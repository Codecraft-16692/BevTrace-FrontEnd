import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an IoT device model within the telemetry domain.
 *
 * @remarks
 * In Domain-Driven Design, DeviceModel is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the telemetry bounded context.
 */
export class DeviceModel implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The model name.
   */
  name: string;

  /**
   * The manufacturer name.
   */
  manufacturer: string;

  /**
   * The sensors supported by the model.
   */
  sensors: string;

  /**
   * Creates a new DeviceModel entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    name: string;
    manufacturer: string;
    sensors: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.manufacturer = params.manufacturer;
    this.sensors = params.sensors;
  }
}
