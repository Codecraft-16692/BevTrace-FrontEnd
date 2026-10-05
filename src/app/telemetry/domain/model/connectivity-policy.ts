import { TelemetryDevice } from './telemetry-device.entity';

/**
 * Minutes without signal after which a device connectivity is critical.
 */
export const CRITICAL_MINUTES = 30;

/**
 * Domain policy that evaluates the connectivity of IoT devices.
 *
 * @remarks
 * A device without signal is considered critical after 30 minutes. The policy
 * is pure and stateless so it can be reused by stores and views.
 */
export class ConnectivityPolicy {
  /**
   * Calculates the minutes elapsed since the last signal of a device.
   *
   * @param device - Device to evaluate
   * @param now - Reference time in epoch milliseconds
   * @returns Whole minutes elapsed since the last received signal
   */
  static minutesWithoutSignal(device: TelemetryDevice, now: number = Date.now()): number {
    return Math.max(0, Math.floor((now - new Date(device.lastSignalAt).getTime()) / 60000));
  }

  /**
   * Determines whether the connectivity of a device is critical.
   *
   * @param device - Device to evaluate
   * @param now - Reference time in epoch milliseconds
   * @returns True when the device is disconnected for more than 30 minutes
   */
  static isCritical(device: TelemetryDevice, now: number = Date.now()): boolean {
    return (
      device.connectionStatus === 'DISCONNECTED' &&
      ConnectivityPolicy.minutesWithoutSignal(device, now) > CRITICAL_MINUTES
    );
  }
}
