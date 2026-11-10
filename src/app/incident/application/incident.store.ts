import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import { BaseStore } from '../../shared/application/base-store';
import { BusinessError } from '../../shared/domain/model/business-error';

import { AlertRule } from '../domain/model/alert-rule.entity';
import { IncidentRecord } from '../domain/model/incident-record.entity';
import { CorrectiveAction } from '../domain/model/corrective-action.entity';
import { Notification } from '../domain/model/notification.entity';
import { AcknowledgeIncidentCommand } from '../domain/model/acknowledge-incident.command';
import { RegisterCorrectiveActionCommand } from '../domain/model/register-corrective-action.command';
import { ResolveIncidentCommand } from '../domain/model/resolve-incident.command';
import { CreateAlertRuleCommand } from '../domain/model/create-alert-rule.command';

import { IncidentApi } from '../infrastructure/incident-api';

/**
 * Signal-based application store for the Incident bounded context.
 *
 * @remarks
 * This store coordinates anomaly detection, the incident lifecycle
 * (open, acknowledged, resolved, reopened) and the in-app notifications.
 * Detection evaluates the active alert rules against the latest telemetry and
 * the traceability logs of the shipments in transit.
 */
@Injectable({ providedIn: 'root' })
export class IncidentStore extends BaseStore {
  /**
   * API facade used to reach the incident endpoints.
   */
  private readonly api = inject(IncidentApi);

  /**
   * Internal signal containing the alert rules.
   */
  private readonly rulesSignal = signal<AlertRule[]>([]);

  /**
   * Internal signal containing the incidents.
   */
  private readonly incidentsSignal = signal<IncidentRecord[]>([]);

  /**
   * Internal signal containing the corrective actions.
   */
  private readonly actionsSignal = signal<CorrectiveAction[]>([]);

  /**
   * Internal signal containing the notifications.
   */
  private readonly notificationsSignal = signal<Notification[]>([]);

  /**
   * Readonly signal exposing the alert rules.
   */
  readonly rules = this.rulesSignal.asReadonly();

  /**
   * Readonly signal exposing the corrective actions.
   */
  readonly actions = this.actionsSignal.asReadonly();

  /**
   * Readonly signal exposing the notifications, newest first.
   */
  readonly notifications = computed(() =>
    [...this.notificationsSignal()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  );

  /**
   * Readonly signal exposing the incidents, newest first.
   */
  readonly incidents = computed(() =>
    [...this.incidentsSignal()].sort((a, b) => b.detectedAt.localeCompare(a.detectedAt)),
  );

  /**
   * Incidents that are not resolved yet.
   */
  readonly activeIncidents = computed(() =>
    this.incidents().filter((incident) => incident.status !== 'RESOLVED'),
  );

  /**
   * Number of critical or high severity incidents that are not resolved.
   */
  readonly criticalCount = computed(
    () =>
      this.activeIncidents().filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length,
  );

  /**
   * Loads rules, incidents and corrective actions.
   */
  loadAll(): void {
    this.read(
      forkJoin({
        rules: this.api.getRules(),
        incidents: this.api.getIncidents(),
        actions: this.api.getActions(),
        notifications: this.api.getNotifications(),
      }),
      'incident.errors.load',
      (result) => {
        this.rulesSignal.set(result.rules);
        this.incidentsSignal.set(result.incidents);
        this.actionsSignal.set(result.actions);
        this.notificationsSignal.set(result.notifications);
      },
    );
  }

  /**
   * Loads the notifications silently.
   */
  loadNotifications(): void {
    this.api.getNotifications().subscribe({
      next: (notifications) => this.notificationsSignal.set(notifications),
      error: () => undefined,
    });
  }

  /**
   * Marks a notification as read.
   *
   * @param id - Identifier of the notification
   */
  markNotificationRead(id: number): void {
    this.api.markNotificationRead(id).subscribe({
      next: () =>
        this.notificationsSignal.update((list) =>
          list.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
        ),
      error: () => undefined,
    });
  }

  /**
   * Returns the corrective actions registered for an incident.
   *
   * @param incidentId - Identifier of the incident
   * @returns Corrective actions ordered by application time
   */
  actionsOf(incidentId: number): CorrectiveAction[] {
    return this.actionsSignal()
      .filter((action) => action.incidentId === incidentId)
      .sort((a, b) => a.appliedAt.localeCompare(b.appliedAt));
  }

  /**
   * Runs the anomaly detection on the backend. It evaluates the active rules against the
   * shipments in transit, avoids duplicates and reopens incidents resolved in the last 24 hours.
   */
  detectAnomalies(): void {
    this.write(
      this.api.detectAnomalies(),
      'incident.errors.generic',
      ({ created, reopened }) => {
        this.publishSuccess({
          key: created + reopened > 0 ? 'incident.dashboard.detected' : 'incident.dashboard.none-detected',
          params: { created, reopened },
        });
        this.refresh();
        this.loadNotifications();
      },
    );
  }

  /**
   * Acknowledges an open incident. The user is taken from the token.
   *
   * @param command - Acknowledgement command
   */
  acknowledge(command: AcknowledgeIncidentCommand): void {
    this.write(
      this.api.acknowledgeIncident(command.incidentId),
      'incident.errors.generic',
      () => this.refresh(),
      { key: 'incident.dashboard.acknowledged' },
    );
  }

  /**
   * Registers a corrective action on an incident.
   *
   * @param command - Corrective action command
   */
  registerCorrectiveAction(command: RegisterCorrectiveActionCommand): void {
    if (command.description.trim().length < 10) {
      this.startOperation();
      this.failOperation(new BusinessError('incident.errors.description-short'), '');
      return;
    }

    this.write(
      this.api.registerCorrectiveAction(command.incidentId, command.description.trim()),
      'incident.errors.generic',
      () => this.refresh(),
      { key: 'incident.dashboard.action-saved' },
    );
  }

  /**
   * Resolves an incident. The backend requires at least one corrective action.
   *
   * @param command - Resolution command
   */
  resolveIncident(command: ResolveIncidentCommand): void {
    this.write(
      this.api.resolveIncident(command.incidentId),
      'incident.errors.generic',
      () => {
        this.refresh();
        this.loadNotifications();
      },
      { key: 'incident.dashboard.resolved' },
    );
  }

  /**
   * Creates an alert rule.
   *
   * @param command - Rule creation command
   */
  createRule(command: CreateAlertRuleCommand): void {
    if (!(command.threshold > 0)) {
      this.startOperation();
      this.failOperation(new BusinessError('incident.errors.threshold-invalid'), '');
      return;
    }

    this.write(
      this.api.createRule({ ...command, description: command.description.trim() }),
      'incident.errors.generic',
      () => this.refresh(),
      { key: 'incident.rules.saved' },
    );
  }

  /**
   * Enables or disables an alert rule.
   *
   * @param id     - Identifier of the rule
   * @param active - New activation state
   */
  setRuleActive(id: number, active: boolean): void {
    this.write(this.api.setRuleActive(id, active), 'incident.errors.generic', () => this.refresh());
  }

  /**
   * Reloads rules, incidents and actions silently after a write operation.
   */
  private refresh(): void {
    forkJoin({
      rules: this.api.getRules(),
      incidents: this.api.getIncidents(),
      actions: this.api.getActions(),
    }).subscribe((result) => {
      this.rulesSignal.set(result.rules);
      this.incidentsSignal.set(result.incidents);
      this.actionsSignal.set(result.actions);
    });
  }
}
