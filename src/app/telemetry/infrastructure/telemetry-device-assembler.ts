import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { TelemetryDevice } from '../domain/model/telemetry-device.entity';
import { TelemetryDeviceResource, TelemetryDevicesResponse } from './telemetry-device-response';

/**
 * Assembler for converting between TelemetryDevice domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class TelemetryDeviceAssembler implements BaseAssembler<
  TelemetryDevice,
  TelemetryDeviceResource,
  TelemetryDevicesResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of TelemetryDevice domain entities
   */
  toEntitiesFromResponse(response: TelemetryDevicesResponse): TelemetryDevice[] {
    return response.devices.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns TelemetryDevice domain entity
   */
  toEntityFromResource(resource: TelemetryDeviceResource): TelemetryDevice {
    return new TelemetryDevice({
      id: resource.id,
      vehicleId: resource.vehicleId,
      modelId: resource.modelId,
      deviceCode: resource.deviceCode,
      installedAt: resource.installedAt,
      isActive: resource.isActive,
      connectionStatus: resource.connectionStatus,
      lastSignalAt: resource.lastSignalAt,
      vehiclePlate: resource.vehicle?.plateNumber ?? '',
      modelName: resource.model?.name ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - TelemetryDevice domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: TelemetryDevice): TelemetryDeviceResource {
    return {
      id: entity.id,
      vehicleId: entity.vehicleId,
      modelId: entity.modelId,
      deviceCode: entity.deviceCode,
      installedAt: entity.installedAt,
      isActive: entity.isActive,
      connectionStatus: entity.connectionStatus,
      lastSignalAt: entity.lastSignalAt,
    };
  }
}
