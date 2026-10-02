import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AnalyticsStore } from '../../../application/analytics.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component that renders the logistics performance dashboard.
 *
 * @remarks
 * This presentation component follows the "Logistics Performance Dashboard"
 * wireframe. It shows the five indicators of the selected period compared with
 * the previous one (including the shrinkage rate and its variation), a weekly
 * shrinkage trend, the regional delivery performance and the warehouse zones.
 */
@Component({
  selector: 'app-kpi-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    TranslateModule,
    BaseChartDirective,
    MatIconModule,
    MatProgressSpinnerModule,
    MessageBanner,
  ],
  templateUrl: './kpi-dashboard.html',
  styleUrl: './kpi-dashboard.css',
})
export class KpiDashboard implements OnInit {
  /**
   * Store that manages analytics state.
   */
  protected readonly store = inject(AnalyticsStore);

  /**
   * Length in days of the selected period.
   */
  protected readonly days = signal<number>(30);

  /**
   * Options offered in the period selector.
   */
  protected readonly periods = [7, 30, 90];

  /**
   * Data of the shrinkage trend chart.
   */
  protected readonly trendData = computed<ChartData<'line'>>(() => ({
    labels: this.store.shrinkageTrend().map((week) => week.label),
    datasets: [
      {
        data: this.store.shrinkageTrend().map((week) => week.value),
        label: 'Units lost',
        borderColor: '#c62828',
        backgroundColor: 'rgba(198, 40, 40, 0.15)',
        fill: true,
        tension: 0.35,
      },
    ],
  }));

  /**
   * Data of the regional performance chart.
   */
  protected readonly regionData = computed<ChartData<'bar'>>(() => ({
    labels: this.store.regionalPerformance().map((item) => item.region),
    datasets: [
      { data: this.store.regionalPerformance().map((item) => item.onTime), label: 'On time', backgroundColor: '#2e7d32' },
      { data: this.store.regionalPerformance().map((item) => item.late), label: 'Late', backgroundColor: '#c62828' },
    ],
  }));

  /**
   * Shared options of the charts.
   */
  protected readonly chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  };

  /**
   * Lifecycle hook that loads the operational data.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Selects the length of the period.
   *
   * @param days - Length of the period in days
   */
  protected onPeriod(days: number): void {
    this.days.set(days);
    this.store.selectLastDays(days);
  }

  /**
   * Calculates the variation of an indicator against the previous period.
   *
   * @param current - Value of the selected period
   * @param previous - Value of the previous period
   * @returns Difference in percentage points, rounded to two decimals
   */
  protected delta(current: number, previous: number): number {
    return Math.round((current - previous) * 100) / 100;
  }
}
