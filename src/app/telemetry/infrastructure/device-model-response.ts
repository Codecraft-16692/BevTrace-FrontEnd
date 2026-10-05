import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

/**
 * Resource representation of an IoT device model for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface DeviceModelResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The model name.
   */
  name: string;

  /**
   * The manufacturer name.
   */
  manufacturer: string;

  /**
   * The sensors supported by the model.
   */
  sensors: string;
}

/**
 * Response envelope for an IoT device model collection queries.
 */
export interface DeviceModelsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  models: DeviceModelResource[];
}
