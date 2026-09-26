import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { AnalyticsStore } from '../../../application/analytics.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { LogisticsReport } from '../../../domain/model/logistics-report.entity';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';

/**
 * Component that generates and lists the consolidated logistics reports.
 *
 * @remarks
 * This presentation component supports the "generate logistics report" user
 * story. The manager chooses a period and the store consolidates the
 * indicators; periods without operational data are rejected. Reports can be
 * downloaded as CSV.
 */
@Component({
  selector: 'app-report-generator',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule, TranslateModule, MatIconModule, MessageBanner],
  templateUrl: './report-generator.html',
  styleUrl: './report-generator.css',
})
export class ReportGenerator implements OnInit {
  /**
   * Store that manages analytics state.
   */
  protected readonly store = inject(AnalyticsStore);

  /**
   * Store that exposes the signed in manager.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * Latest selectable date (today).
   */
  protected readonly today = new Date().toISOString().split('T')[0];

  /**
   * Reactive form used to capture the period.
   */
  protected readonly form = new FormGroup({
    periodStart: new FormControl<string>(
      new Date(Date.now() - 29 * 86400000).toISOString().split('T')[0],
      { nonNullable: true, validators: [Validators.required] },
    ),
    periodEnd: new FormControl<string>(this.today, {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  /**
   * Lifecycle hook that loads the operational data.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Submits the report form.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.store.generateReport({
      userId: this.iamStore.currentUserId() ?? 0,
      periodStart: value.periodStart,
      periodEnd: value.periodEnd,
    });
  }

  /**
   * Finds the value of a metric of a report.
   *
   * @param report - Report to read
   * @param metric - Metric code
   * @returns Value of the metric or zero
   */
  protected metric(report: LogisticsReport, metric: string): number {
    return report.kpis.find((item) => item.metricName === metric)?.actualValue ?? 0;
  }

  /**
   * Downloads a report as a CSV file.
   *
   * @param report - Report to download
   */
  protected downloadCsv(report: LogisticsReport): void {
    const rows = [
      'metric,value',
      ...report.kpis.map((item) => `${item.metricName},${item.actualValue}`),
    ];
    const blob = new Blob([`period,${report.periodStart} to ${report.periodEnd}\n${rows.join('\n')}\n`], {
      type: 'text/csv;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bevtrace-report-${report.periodStart}-${report.periodEnd}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }
}
