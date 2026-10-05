/**
 * Command for marking a device as disconnected.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface LoseConnectivityCommand {
  /**
   * The identifier of the device.
   */
  deviceId: number;
}
