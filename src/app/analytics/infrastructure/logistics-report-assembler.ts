import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { LogisticsReport } from '../domain/model/logistics-report.entity';
import { LogisticsReportResource, LogisticsReportsResponse } from './logistics-report-response';

/**
 * Assembler for converting between LogisticsReport domain entities and API resources.
 *
 * @remarks
 * This assembler belongs to the infrastructure layer and protects the domain
 * model from API response shape details.
 */
export class LogisticsReportAssembler implements BaseAssembler<
  LogisticsReport,
  LogisticsReportResource,
  LogisticsReportsResponse
> {
  /**
   * Converts a response envelope into domain entities.
   *
   * @param response - API response containing resources
   * @returns Array of LogisticsReport domain entities
   */
  toEntitiesFromResponse(response: LogisticsReportsResponse): LogisticsReport[] {
    return response.reports.map((resource) => this.toEntityFromResource(resource));
  }

  /**
   * Converts an API resource into a domain entity.
   *
   * @param resource - Resource received from the API
   * @returns LogisticsReport domain entity
   */
  toEntityFromResource(resource: LogisticsReportResource): LogisticsReport {
    return new LogisticsReport({
      id: resource.id,
      userId: resource.userId,
      periodStart: resource.periodStart,
      periodEnd: resource.periodEnd,
      createdAt: resource.createdAt,
      kpis: resource.kpis,
      generatedByName: resource.user?.name ?? '',
    });
  }

  /**
   * Converts a domain entity into an API resource.
   *
   * @param entity - LogisticsReport domain entity
   * @returns Resource ready for API communication
   */
  toResourceFromEntity(entity: LogisticsReport): LogisticsReportResource {
    return {
      id: entity.id,
      userId: entity.userId,
      periodStart: entity.periodStart,
      periodEnd: entity.periodEnd,
      createdAt: entity.createdAt,
      kpis: entity.kpis,
    };
  }
}
