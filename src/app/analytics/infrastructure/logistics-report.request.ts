import { KpiMetric } from '../domain/model/kpi-metric';

/**
 * Request payload for creating a consolidated logistics report.
 *
 * @remarks
 * This interface belongs to the infrastructure layer and represents the HTTP
 * request body sent to the mock REST API. System-generated fields are excluded.
 */
export interface CreateLogisticsReportRequest {
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
}
