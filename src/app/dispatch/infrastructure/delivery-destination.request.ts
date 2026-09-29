/**
 * Request payload for creating a delivery destination.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateDeliveryDestinationRequest {
  /**
   * The client name.
   */
  clientName: string;

  /**
   * The delivery address.
   */
  address: string;

  /**
   * The destination latitude.
   */
  latitude: number;

  /**
   * The destination longitude.
   */
  longitude: number;

  /**
   * The commercial region of the destination.
   */
  region: string;
}
