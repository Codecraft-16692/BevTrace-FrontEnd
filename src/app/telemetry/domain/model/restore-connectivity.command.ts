/**
 * Command for marking a device as reconnected.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface RestoreConnectivityCommand {
  /**
   * The identifier of the device.
   */
  deviceId: number;

  /**
   * Indicates whether the device reported incomplete data after reconnecting.
   */
  incompleteData: boolean;
}
