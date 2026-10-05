import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an IoT telemetry device within the telemetry domain.
 *
 * @remarks
 * In Domain-Driven Design, TelemetryDevice is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the telemetry bounded context.
 */
export class TelemetryDevice implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the vehicle carrying the device.
   */
  vehicleId: number;

  /**
   * The identifier of the device model.
   */
  modelId: number;

  /**
   * The unique hardware code of the device.
   */
  deviceCode: string;

  /**
   * The ISO 8601 installation timestamp.
   */
  installedAt: string;

  /**
   * Indicates whether the device is provisioned and active.
   */
  isActive: boolean;

  /**
   * The current connectivity status.
   */
  connectionStatus: 'CONNECTED' | 'DISCONNECTED';

  /**
   * The ISO 8601 timestamp of the last received signal.
   */
  lastSignalAt: string;

  /**
   * The plate of the vehicle carrying the device.
   */
  vehiclePlate: string;

  /**
   * The name of the device model.
   */
  modelName: string;

  /**
   * Creates a new TelemetryDevice entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    vehicleId: number;
    modelId: number;
    deviceCode: string;
    installedAt: string;
    isActive: boolean;
    connectionStatus: 'CONNECTED' | 'DISCONNECTED';
    lastSignalAt: string;
    vehiclePlate: string;
    modelName: string;
  }) {
    this.id = params.id;
    this.vehicleId = params.vehicleId;
    this.modelId = params.modelId;
    this.deviceCode = params.deviceCode;
    this.installedAt = params.installedAt;
    this.isActive = params.isActive;
    this.connectionStatus = params.connectionStatus;
    this.lastSignalAt = params.lastSignalAt;
    this.vehiclePlate = params.vehiclePlate;
    this.modelName = params.modelName;
  }
}
