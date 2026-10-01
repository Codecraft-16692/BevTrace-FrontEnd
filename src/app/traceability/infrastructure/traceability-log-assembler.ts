import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { TraceabilityLog } from '../domain/model/traceability-log.entity';
import { TraceabilityLogResource, TraceabilityLogsResponse } from './traceability-log-response';

/**
 * Assembler for converting between TraceabilityLog domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class TraceabilityLogAssembler implements BaseAssembler<
  TraceabilityLog,
  TraceabilityLogResource,
  TraceabilityLogsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of TraceabilityLog domain entities
   */
  toEntitiesFromResponse(response: TraceabilityLogsResponse): TraceabilityLog[] {
    return response.logs.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns TraceabilityLog domain entity
   */
  toEntityFromResource(resource: TraceabilityLogResource): TraceabilityLog {
    return new TraceabilityLog({
      id: resource.id,
      dispatchOrderId: resource.dispatchOrderId,
      currentStatus: resource.currentStatus,
      startTime: resource.startTime,
      endTime: resource.endTime,
      estimatedArrival: resource.estimatedArrival,
      currentLatitude: resource.currentLatitude,
      currentLongitude: resource.currentLongitude,
      rejectionReason: resource.rejectionReason,
      orderPriority: resource.orderPriority,
      destinationName: resource.destinationName,
      vehiclePlate: resource.vehiclePlate,
      deviceId: resource.deviceId,
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - TraceabilityLog domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: TraceabilityLog): TraceabilityLogResource {
    return {
      id: entity.id,
      dispatchOrderId: entity.dispatchOrderId,
      currentStatus: entity.currentStatus,
      startTime: entity.startTime,
      endTime: entity.endTime,
      estimatedArrival: entity.estimatedArrival,
      currentLatitude: entity.currentLatitude,
      currentLongitude: entity.currentLongitude,
      rejectionReason: entity.rejectionReason,
      orderPriority: entity.orderPriority,
      destinationName: entity.destinationName,
      vehiclePlate: entity.vehiclePlate,
      deviceId: entity.deviceId,
    };
  }
}
