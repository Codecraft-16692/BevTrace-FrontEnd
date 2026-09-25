/**
 * Request payload for creating a physical warehouse zone.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateWarehouseZoneRequest {
  /**
   * The zone name.
   */
  name: string;

  /**
   * The aisle code.
   */
  aisle: string;

  /**
   * The rack code.
   */
  rack: string;
}
