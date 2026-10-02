import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { IncidentStore } from '../../../application/incident.store';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that manages the alert rules used by the anomaly detection.
 *
 * @remarks
 * This presentation component lists the tolerance rules (maximum temperature,
 * delay and signal loss) and allows creating, enabling and disabling them.
 */
@Component({
  selector: 'app-alert-rules',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatSlideToggleModule,
    MessageBanner,
    StatusChip,
  ],
  templateUrl: './alert-rules.html',
  styleUrl: './alert-rules.css',
})
export class AlertRules implements OnInit {
  /**
   * Store that manages incident state.
   */
  protected readonly store = inject(IncidentStore);

  /**
   * Columns displayed in the rules table.
   */
  protected readonly displayedColumns = ['conditionType', 'threshold', 'severity', 'description', 'active'];

  /**
   * Condition types supported by the detection.
   */
  protected readonly conditions = ['TEMPERATURE_MAX', 'DELAY_MINUTES', 'SIGNAL_LOSS_MINUTES'] as const;

  /**
   * Severities available for a rule.
   */
  protected readonly severities = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

  /**
   * Reactive form used to capture a new rule.
   */
  protected readonly form = new FormGroup({
    conditionType: new FormControl<(typeof this.conditions)[number]>('TEMPERATURE_MAX', { nonNullable: true }),
    threshold: new FormControl<number>(30, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    severity: new FormControl<(typeof this.severities)[number]>('MEDIUM', { nonNullable: true }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5)],
    }),
  });

  /**
   * Lifecycle hook that loads the rules.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Submits the rule form.
   */
  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue();
    this.store.createRule({
      conditionType: value.conditionType,
      threshold: Number(value.threshold),
      severity: value.severity,
      description: value.description,
    });
    this.form.controls.description.reset('');
  }

  /**
   * Enables or disables a rule.
   *
   * @param id - Identifier of the rule
   * @param active - New activation state
   */
  protected onToggle(id: number, active: boolean): void {
    this.store.setRuleActive(id, active);
  }
}
