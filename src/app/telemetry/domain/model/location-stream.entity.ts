import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a telemetry reading within the telemetry domain.
 *
 * @remarks
 * In Domain-Driven Design, LocationStream is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the telemetry bounded context.
 */
export class LocationStream implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the emitting device.
   */
  deviceId: number;

  /**
   * The reported latitude.
   */
  latitude: number;

  /**
   * The reported longitude.
   */
  longitude: number;

  /**
   * The reported speed in km/h.
   */
  speed: number;

  /**
   * The reported cargo temperature in degrees Celsius.
   */
  temperature: number;

  /**
   * The ISO 8601 timestamp of the reading.
   */
  timestamp: string;

  /**
   * The hardware code of the emitting device.
   */
  deviceCode: string;

  /**
   * Creates a new LocationStream entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    deviceId: number;
    latitude: number;
    longitude: number;
    speed: number;
    temperature: number;
    timestamp: string;
    deviceCode: string;
  }) {
    this.id = params.id;
    this.deviceId = params.deviceId;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
    this.speed = params.speed;
    this.temperature = params.temperature;
    this.timestamp = params.timestamp;
    this.deviceCode = params.deviceCode;
  }
}
