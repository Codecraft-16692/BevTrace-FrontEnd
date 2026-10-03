/**
 * Command for provisioning a new IoT device.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface ProvisionDeviceCommand {
  /**
   * The unique hardware code of the device.
   */
  deviceCode: string;

  /**
   * The identifier of the vehicle carrying the device.
   */
  vehicleId: number;

}
