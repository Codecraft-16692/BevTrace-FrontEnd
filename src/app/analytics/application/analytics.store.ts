import { computed, inject, Injectable, signal } from '@angular/core';
import { defer, forkJoin, throwError } from 'rxjs';

import { BaseStore } from '../../shared/application/base-store';
import { BusinessError } from '../../shared/domain/model/business-error';

import { LogisticsReport } from '../domain/model/logistics-report.entity';
import { GenerateLogisticsReportCommand } from '../domain/model/generate-logistics-report.command';
import { Indicators, KpiCalculator, OperationalData } from '../domain/model/kpi-calculator';

import { AnalyticsApi } from '../infrastructure/analytics-api';
import { InventoryApi } from '../../inventory/infrastructure/inventory-api';
import { DispatchApi } from '../../dispatch/infrastructure/dispatch-api';

/**
 * Period selected in the dashboard.
 */
export interface Period {
  /**
   * First day of the period in ISO date format.
   */
  start: string;

  /**
   * Last day of the period in ISO date format.
   */
  end: string;
}

/**
 * Formats a date as an ISO date string.
 *
 * @param date - Date to format
 * @returns Date in YYYY-MM-DD format
 */
const isoDay = (date: Date): string => date.toISOString().split('T')[0];

/**
 * Builds a period that ends today.
 *
 * @param days - Length of the period in days
 * @returns Period between days-1 days ago and today
 */
const lastDays = (days: number): Period => {
  const end = new Date();
  const start = new Date(end.getTime() - (days - 1) * 86400000);
  return { start: isoDay(start), end: isoDay(end) };
};

/**
 * Signal-based application store for the Analytics bounded context.
 *
 * @remarks
 * This store reads the operational data of the inventory and dispatch contexts
 * and calculates the logistics indicators (OTIF, Fill Rate, ERI, inventory
 * rotation and shrinkage rate) for a selected period, compared with the
 * previous period of the same length. It also generates the consolidated
 * reports.
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsStore extends BaseStore {
  /**
   * API facade used to reach the report endpoint.
   */
  private readonly api = inject(AnalyticsApi);

  /**
   * API facade used to read inventory data.
   */
  private readonly inventoryApi = inject(InventoryApi);

  /**
   * API facade used to read dispatch data.
   */
  private readonly dispatchApi = inject(DispatchApi);

  /**
   * Internal signal containing the operational data.
   */
  private readonly dataSignal = signal<OperationalData>({
    orders: [],
    batches: [],
    waste: [],
    reconciliations: [],
  });

  /**
   * Internal signal containing the generated reports.
   */
  private readonly reportsSignal = signal<LogisticsReport[]>([]);

  /**
   * Internal signal containing the selected period.
   */
  private readonly periodSignal = signal<Period>(lastDays(30));

  /**
   * Readonly signal exposing the selected period.
   */
  readonly period = this.periodSignal.asReadonly();

  /**
   * Readonly signal exposing the reports, newest first.
   */
  readonly reports = computed(() =>
    [...this.reportsSignal()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );

  /**
   * Indicators of the selected period.
   */
  readonly indicators = computed<Indicators>(() =>
    KpiCalculator.calculate(this.dataSignal(), this.period().start, this.period().end),
  );

  /**
   * Indicators of the previous period of the same length.
   */
  readonly previousIndicators = computed<Indicators>(() => {
    const previous = this.previousPeriod(this.period());
    return KpiCalculator.calculate(this.dataSignal(), previous.start, previous.end);
  });

  /**
   * Weekly shrinkage of the last eight weeks for the trend chart.
   */
  readonly shrinkageTrend = computed(() => {
    const data = this.dataSignal();
    const weeks: { label: string; value: number }[] = [];
    for (let i = 7; i >= 0; i--) {
      const end = new Date(Date.now() - i * 7 * 86400000);
      const start = new Date(end.getTime() - 6 * 86400000);
      const lost = data.waste
        .filter((record) => KpiCalculator.inPeriod(record.reportedDate, isoDay(start), isoDay(end)))
        .reduce((sum, record) => sum + record.quantity, 0);
      weeks.push({ label: isoDay(end).slice(5), value: lost });
    }
    return weeks;
  });

  /**
   * On time and late deliveries of the selected period grouped by region.
   */
  readonly regionalPerformance = computed(() => {
    const delivered = KpiCalculator.deliveredIn(this.dataSignal(), this.period().start, this.period().end);
    const regions = Array.from(new Set(delivered.map((order) => order.destinationRegion)));
    return regions.map((region) => {
      const orders = delivered.filter((order) => order.destinationRegion === region);
      const onTime = orders.filter((order) => KpiCalculator.isOnTime(order)).length;
      return { region, onTime, late: orders.length - onTime };
    });
  });

  /**
   * Stock and waste of every storage zone.
   */
  readonly zoneOverview = computed(() => {
    const data = this.dataSignal();
    const zones = Array.from(new Set(data.batches.map((batch) => batch.zoneName)));
    return zones.map((zone) => {
      const batches = data.batches.filter((batch) => batch.zoneName === zone);
      const ids = new Set(batches.map((batch) => batch.id));
      const units = batches
        .filter((batch) => batch.status === 'AVAILABLE')
        .reduce((sum, batch) => sum + batch.currentQty, 0);
      const lost = data.waste.filter((record) => ids.has(record.batchId)).reduce((sum, record) => sum + record.quantity, 0);
      const received = batches
        .filter((batch) => batch.receivedAt !== null)
        .reduce((sum, batch) => sum + batch.initialQty, 0);
      return {
        zone,
        batches: batches.filter((batch) => batch.status === 'AVAILABLE').length,
        units,
        lost,
        shrinkage: received === 0 ? 0 : Math.round((lost / received) * 10000) / 100,
      };
    });
  });

  /**
   * Loads the operational data and the reports.
   */
  loadAll(): void {
    this.read(
      forkJoin({
        reports: this.api.getReports(),
        orders: this.dispatchApi.getOrders(),
        batches: this.inventoryApi.getBatches(),
        waste: this.inventoryApi.getWasteRecords(),
        reconciliations: this.inventoryApi.getReconciliations(),
      }),
      'analytics.errors.load',
      (result) => {
        this.reportsSignal.set(result.reports);
        this.dataSignal.set({
          orders: result.orders,
          batches: result.batches,
          waste: result.waste,
          reconciliations: result.reconciliations,
        });
      },
    );
  }

  /**
   * Selects a period that ends today.
   *
   * @param days - Length of the period in days
   */
  selectLastDays(days: number): void {
    this.periodSignal.set(lastDays(days));
  }

  /**
   * Selects a custom period.
   *
   * @param period - Period chosen by the user
   */
  selectPeriod(period: Period): void {
    this.periodSignal.set(period);
  }

  /**
   * Generates a consolidated report for a period.
   *
   * @param command - Command containing the user and the period
   */
  generateReport(command: GenerateLogisticsReportCommand): void {
    const operation = defer(() => {
      if (!command.periodStart || !command.periodEnd || command.periodEnd < command.periodStart) {
        return throwError(() => new BusinessError('analytics.errors.invalid-period'));
      }
      const indicators = KpiCalculator.calculate(this.dataSignal(), command.periodStart, command.periodEnd);
      if (!indicators.hasData) {
        return throwError(() => new BusinessError('analytics.errors.no-data'));
      }
      return this.api.createReport({
        userId: command.userId,
        periodStart: command.periodStart,
        periodEnd: command.periodEnd,
        createdAt: new Date().toISOString(),
        kpis: KpiCalculator.toMetrics(indicators),
      });
    });

    this.write(
      operation,
      'analytics.errors.generic',
      () => this.api.getReports().subscribe((reports) => this.reportsSignal.set(reports)),
      { key: 'analytics.reports.success' },
    );
  }

  /**
   * Builds the previous period of the same length.
   *
   * @param period - Reference period
   * @returns Period that ends the day before the reference starts
   */
  private previousPeriod(period: Period): Period {
    const start = new Date(period.start).getTime();
    const end = new Date(period.end).getTime();
    const length = Math.round((end - start) / 86400000) + 1;
    const previousEnd = new Date(start - 86400000);
    const previousStart = new Date(previousEnd.getTime() - (length - 1) * 86400000);
    return { start: isoDay(previousStart), end: isoDay(previousEnd) };
  }
}
