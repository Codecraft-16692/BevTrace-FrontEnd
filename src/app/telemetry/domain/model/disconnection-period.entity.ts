import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a device disconnection period within the telemetry domain.
 *
 * @remarks
 * In Domain-Driven Design, DisconnectionPeriod is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the telemetry bounded context.
 */
export class DisconnectionPeriod implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the device.
   */
  deviceId: number;

  /**
   * The ISO 8601 timestamp when the signal was lost.
   */
  startedAt: string;

  /**
   * The ISO 8601 timestamp when the signal was restored.
   */
  endedAt: string | null;

  /**
   * Indicates whether telemetry for the period is available.
   */
  dataStatus: 'AVAILABLE' | 'UNAVAILABLE';

  /**
   * The hardware code of the device.
   */
  deviceCode: string;

  /**
   * Creates a new DisconnectionPeriod entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    deviceId: number;
    startedAt: string;
    endedAt: string | null;
    dataStatus: 'AVAILABLE' | 'UNAVAILABLE';
    deviceCode: string;
  }) {
    this.id = params.id;
    this.deviceId = params.deviceId;
    this.startedAt = params.startedAt;
    this.endedAt = params.endedAt;
    this.dataStatus = params.dataStatus;
    this.deviceCode = params.deviceCode;
  }
}
