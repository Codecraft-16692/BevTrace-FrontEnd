import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { KpiMetric } from '../domain/model/kpi-metric';

/**
 * Resource representation of a consolidated logistics report for API communication.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and mirrors the mock REST
 * resource contract exposed by json-server until the backend becomes available.
 */
export interface LogisticsReportResource extends BaseResource {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the user who generated the report.
   */
  userId: number;

  /**
   * The start of the evaluated period in ISO date format.
   */
  periodStart: string;

  /**
   * The end of the evaluated period in ISO date format.
   */
  periodEnd: string;

  /**
   * The ISO 8601 timestamp of the report generation.
   */
  createdAt: string;

  /**
   * The consolidated indicators of the period.
   */
  kpis: KpiMetric[];

  /**
   * Embedded user returned by the `_expand` query.
   */
  user?: { name: string };
}

/**
 * Response envelope for a consolidated logistics report collection queries.
 */
export interface LogisticsReportsResponse extends BaseResponse {
  /**
   * Array of resources returned by the API.
   */
  reports: LogisticsReportResource[];
}
