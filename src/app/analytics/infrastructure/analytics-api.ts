import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';

import { LogisticsReport } from '../domain/model/logistics-report.entity';
import { LogisticsReportApiEndpoint } from './logistics-report-api-endpoint';
import { CreateLogisticsReportRequest } from './logistics-report.request';

/**
 * HTTP API facade for the Analytics bounded context.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over the logistics report endpoint
 * client. The operational data used to calculate the indicators is read
 * through the facades of the inventory and dispatch contexts.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsApi extends BaseApi {
  /**
   * Endpoint client for logistics reports.
   */
  private readonly reportEndpoint: LogisticsReportApiEndpoint;

  /**
   * Creates a new AnalyticsApi facade.
   *
   * @param http - Angular HttpClient used by endpoint clients
   */
  constructor(http: HttpClient) {
    super();
    this.reportEndpoint = new LogisticsReportApiEndpoint(http);
  }

  /**
   * Retrieves every generated report.
   *
   * @returns Observable stream emitting LogisticsReport entities
   */
  getReports(): Observable<LogisticsReport[]> {
    return this.reportEndpoint.getAll();
  }

  /**
   * Creates a logistics report.
   *
   * @param request - Report creation payload
   * @returns Observable stream emitting the created LogisticsReport
   */
  createReport(request: CreateLogisticsReportRequest): Observable<LogisticsReport> {
    return this.reportEndpoint.createFromRequest(request);
  }
}
