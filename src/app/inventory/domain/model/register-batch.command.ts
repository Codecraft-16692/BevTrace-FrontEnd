/**
 * Command for registering an expected product batch.
 *
 * @remarks
 * In CQRS, this command represents the intent of the user, captured by the
 * presentation layer and executed by the application store.
 */
export interface RegisterBatchCommand {
  /**
   * The identifier of the product.
   */
  productId: number;

  /**
   * The identifier of the destination warehouse zone.
   */
  zoneId: number;

  /**
   * The batch code printed on the pallet label.
   */
  batchNumber: string;

  /**
   * The announced quantity of units.
   */
  initialQty: number;

  /**
   * The expiration date in ISO date format.
   */
  expirationDate: string;
}
