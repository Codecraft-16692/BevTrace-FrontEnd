/**
 * Command for validating the loaded pallets against the order.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface ValidateCargoCommand {
  /**
   * The identifier of the dispatch order.
   */
  dispatchOrderId: number;

  /**
   * The pallet labels read by the bulk scanner.
   */
  scannedPallets: string[];
}
