import { KpiMetric } from './kpi-metric';
import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a consolidated logistics report within the analytics domain.
 *
 * @remarks
 * In Domain-Driven Design, LogisticsReport is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the analytics bounded context.
 */
export class LogisticsReport implements BaseEntity {
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
   * The name of the user who generated the report.
   */
  generatedByName: string;

  /**
   * Creates a new LogisticsReport entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    userId: number;
    periodStart: string;
    periodEnd: string;
    createdAt: string;
    kpis: KpiMetric[];
    generatedByName: string;
  }) {
    this.id = params.id;
    this.userId = params.userId;
    this.periodStart = params.periodStart;
    this.periodEnd = params.periodEnd;
    this.createdAt = params.createdAt;
    this.kpis = params.kpis;
    this.generatedByName = params.generatedByName;
  }
}
