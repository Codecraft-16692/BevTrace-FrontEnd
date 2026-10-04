import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { IncidentStore } from '../../../application/incident.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { IncidentRecord } from '../../../domain/model/incident-record.entity';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that renders the incident dashboard and its resolution workflow.
 *
 * @remarks
 * This presentation component supports the anomaly detection, incident
 * resolution and corrective action user stories. The user runs the detection,
 * selects an incident, acknowledges it, registers corrective actions and
 * resolves it. Recurrences within 24 hours reopen the previous incident.
 */
@Component({
  selector: 'app-incident-dashboard',
  standalone: true,
  imports: [
    DatePipe,
    TranslateModule,
    MatTableModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MessageBanner,
    StatusChip,
  ],
  templateUrl: './incident-dashboard.html',
  styleUrl: './incident-dashboard.css',
})
export class IncidentDashboard implements OnInit {
  /**
   * Store that manages incident state.
   */
  protected readonly store = inject(IncidentStore);

  /**
   * Store that exposes the signed in user.
   */
  private readonly iamStore = inject(IamStore);

  /**
   * Columns displayed in the incident table.
   */
  protected readonly displayedColumns = ['severity', 'anomalyType', 'destinationName', 'vehiclePlate', 'detectedAt', 'status'];

  /**
   * Filter applied to the incident list.
   */
  protected readonly filter = signal<'active' | 'resolved' | 'all'>('active');

  /**
   * Identifier of the selected incident.
   */
  protected readonly selectedId = signal<number | null>(null);

  /**
   * Description typed for a new corrective action.
   */
  protected readonly actionText = signal<string>('');

  /**
   * Incidents matching the active filter.
   */
  protected readonly filtered = computed(() => {
    const filter = this.filter();
    return this.store
      .incidents()
      .filter((incident) =>
        filter === 'all' ? true : filter === 'active' ? incident.status !== 'RESOLVED' : incident.status === 'RESOLVED',
      );
  });

  /**
   * Incident currently selected in the table.
   */
  protected readonly selected = computed<IncidentRecord | null>(
    () => this.store.incidents().find((incident) => incident.id === this.selectedId()) ?? null,
  );

  /**
   * Lifecycle hook that loads the incident data.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Selects an incident to work on.
   *
   * @param incident - Incident selected in the table
   */
  protected select(incident: IncidentRecord): void {
    this.selectedId.set(incident.id);
    this.actionText.set('');
  }

  /**
   * Runs the anomaly detection.
   */
  protected onDetect(): void {
    this.store.detectAnomalies();
  }

  /**
   * Acknowledges the selected incident.
   */
  protected onAcknowledge(): void {
    const incident = this.selected();
    if (!incident) return;
    this.store.acknowledge({ incidentId: incident.id, userId: this.iamStore.currentUserId() ?? 0 });
  }

  /**
   * Registers the typed corrective action for the selected incident.
   */
  protected onSaveAction(): void {
    const incident = this.selected();
    if (!incident) return;
    this.store.registerCorrectiveAction({
      incidentId: incident.id,
      userId: this.iamStore.currentUserId() ?? 0,
      description: this.actionText(),
    });
    this.actionText.set('');
  }

  /**
   * Resolves the selected incident.
   */
  protected onResolve(): void {
    const incident = this.selected();
    if (!incident) return;
    this.store.resolveIncident({ incidentId: incident.id });
  }
}
