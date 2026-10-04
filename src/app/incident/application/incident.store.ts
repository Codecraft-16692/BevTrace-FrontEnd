import { computed, inject, Injectable, signal } from '@angular/core';
import { defer, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';

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
import { TelemetryApi } from '../../telemetry/infrastructure/telemetry-api';
import { TraceabilityApi } from '../../traceability/infrastructure/traceability-api';
import { CreateIncidentRecordRequest } from '../infrastructure/incident-record.request';

/**
 * Hours during which a resolved incident is reopened instead of duplicated.
 */
const REOPEN_WINDOW_HOURS = 24;

/**
 * Payload used to publish an in-app notification.
 */
export interface NotifyPayload {
  /**
   * Role that receives the notification.
   */
  recipientRole: string;

  /**
   * Notification category.
   */
  type: Notification['type'];

  /**
   * Notification title.
   */
  title: string;

  /**
   * Notification message.
   */
  message: string;
}

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
   * API facade used to read telemetry data during detection.
   */
  private readonly telemetryApi = inject(TelemetryApi);

  /**
   * API facade used to read traceability data during detection.
   */
  private readonly traceabilityApi = inject(TraceabilityApi);

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
   * Publishes an in-app notification for a role.
   *
   * @param payload - Notification data
   */
  notify(payload: NotifyPayload): void {
    this.api
      .createNotification({ ...payload, createdAt: new Date().toISOString(), read: false })
      .subscribe({
        next: (notification) => this.notificationsSignal.update((list) => [notification, ...list]),
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
      next: (updated) =>
        this.notificationsSignal.update((list) => list.map((n) => (n.id === id ? updated : n))),
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
   * Detects anomalies by evaluating the active rules against the latest data.
   */
  detectAnomalies(): void {
    const operation = forkJoin({
      rules: this.api.getRules(),
      incidents: this.api.getIncidents(),
      devices: this.telemetryApi.getDevices(),
      streams: this.telemetryApi.getStreams(),
      logs: this.traceabilityApi.getLogs(),
    }).pipe(
      switchMap(({ rules, incidents, devices, streams, logs }) => {
        const now = Date.now();
        const candidates: Omit<CreateIncidentRecordRequest, 'detectedAt' | 'status'>[] = [];

        logs
          .filter((log) => log.currentStatus === 'IN_TRANSIT')
          .forEach((log) => {
            const device = devices.find((item) => item.id === log.deviceId);
            const lastStream = streams
              .filter((stream) => stream.deviceId === log.deviceId)
              .sort((a, b) => b.timestamp.localeCompare(a.timestamp))[0];

            rules
              .filter((rule) => rule.active)
              .forEach((rule) => {
                let description: string | null = null;

                if (rule.conditionType === 'TEMPERATURE_MAX' && lastStream) {
                  if (lastStream.temperature > rule.threshold) {
                    description = `Cargo temperature reached ${lastStream.temperature} °C (limit ${rule.threshold} °C) on the route to ${log.destinationName}.`;
                  }
                }

                if (rule.conditionType === 'SIGNAL_LOSS_MINUTES' && device) {
                  const minutes = Math.floor((now - new Date(device.lastSignalAt).getTime()) / 60000);
                  if (device.connectionStatus === 'DISCONNECTED' && minutes > rule.threshold) {
                    description = `Device ${device.deviceCode} has been without signal for ${minutes} minutes (limit ${rule.threshold}).`;
                  }
                }

                if (rule.conditionType === 'DELAY_MINUTES') {
                  const delay = Math.floor((now - new Date(log.estimatedArrival).getTime()) / 60000);
                  if (delay > rule.threshold) {
                    description = `Shipment to ${log.destinationName} is ${delay} minutes late (limit ${rule.threshold}).`;
                  }
                }

                if (description) {
                  candidates.push({
                    logId: log.id,
                    ruleId: rule.id,
                    anomalyType: rule.conditionType,
                    severity: rule.severity,
                    description,
                    acknowledgedBy: null,
                    acknowledgedAt: null,
                    resolvedAt: null,
                    reopenCount: 0,
                  });
                }
              });
          });

        const jobs: Observable<unknown>[] = [];
        let created = 0;
        let reopened = 0;

        candidates.forEach((candidate) => {
          const related = incidents.filter(
            (incident) => incident.logId === candidate.logId && incident.ruleId === candidate.ruleId,
          );
          if (related.some((incident) => incident.status !== 'RESOLVED')) return;

          const recent = related
            .filter(
              (incident) =>
                incident.resolvedAt &&
                now - new Date(incident.resolvedAt).getTime() < REOPEN_WINDOW_HOURS * 3600000,
            )
            .sort((a, b) => (b.resolvedAt ?? '').localeCompare(a.resolvedAt ?? ''))[0];

          if (recent) {
            reopened += 1;
            jobs.push(
              this.api.updateIncident(recent.id, {
                status: 'OPEN',
                resolvedAt: null,
                acknowledgedBy: null,
                acknowledgedAt: null,
                reopenCount: recent.reopenCount + 1,
              }),
            );
          } else {
            created += 1;
            jobs.push(
              this.api.createIncident({
                ...candidate,
                status: 'OPEN',
                detectedAt: new Date(now).toISOString(),
              }),
            );
          }
        });

        const work: Observable<unknown> = jobs.length > 0 ? forkJoin(jobs) : of([]);
        return work.pipe(map(() => ({ created, reopened })));
      }),
    );

    this.write(
      operation,
      'incident.errors.generic',
      ({ created, reopened }) => {
        if (created + reopened > 0) {
          this.notify({
            recipientRole: 'ROLE_LOGISTICS_MANAGER',
            type: 'INCIDENT',
            title: 'Anomalies detected',
            message: `${created} new and ${reopened} reopened incidents were detected on active routes.`,
          });
        }
        this.publishSuccess({
          key: created + reopened > 0 ? 'incident.dashboard.detected' : 'incident.dashboard.none-detected',
          params: { created, reopened },
        });
        this.refresh();
      },
    );
  }

  /**
   * Acknowledges an open incident.
   *
   * @param command - Command containing the incident and the acknowledging user
   */
  acknowledge(command: AcknowledgeIncidentCommand): void {
    const operation = defer(() => {
      const incident = this.incidentsSignal().find((item) => item.id === command.incidentId);
      if (!incident || incident.status !== 'OPEN') {
        return throwError(() => new BusinessError('incident.errors.not-open'));
      }
      return this.api.updateIncident(incident.id, {
        status: 'ACKNOWLEDGED',
        acknowledgedBy: command.userId,
        acknowledgedAt: new Date().toISOString(),
      });
    });

    this.write(operation, 'incident.errors.generic', () => this.refresh(), {
      key: 'incident.dashboard.acknowledged',
    });
  }

  /**
   * Registers a corrective action for an incident that is not resolved.
   *
   * @param command - Command containing the incident and the action description
   */
  registerCorrectiveAction(command: RegisterCorrectiveActionCommand): void {
    const operation = defer(() => {
      const incident = this.incidentsSignal().find((item) => item.id === command.incidentId);
      if (!incident || incident.status === 'RESOLVED') {
        return throwError(() => new BusinessError('incident.errors.already-resolved'));
      }
      if (command.description.trim().length < 10) {
        return throwError(() => new BusinessError('incident.errors.description-short'));
      }
      return this.api.createAction({
        incidentId: command.incidentId,
        userId: command.userId,
        description: command.description.trim(),
        appliedAt: new Date().toISOString(),
      });
    });

    this.write(operation, 'incident.errors.generic', () => this.refresh(), {
      key: 'incident.dashboard.action-saved',
    });
  }

  /**
   * Resolves an incident that has at least one corrective action.
   *
   * @param command - Command containing the incident
   */
  resolveIncident(command: ResolveIncidentCommand): void {
    const operation = defer(() => {
      const incident = this.incidentsSignal().find((item) => item.id === command.incidentId);
      if (!incident || incident.status === 'RESOLVED') {
        return throwError(() => new BusinessError('incident.errors.already-resolved'));
      }
      if (this.actionsOf(incident.id).length === 0) {
        return throwError(() => new BusinessError('incident.errors.action-required'));
      }
      return this.api.updateIncident(incident.id, {
        status: 'RESOLVED',
        resolvedAt: new Date().toISOString(),
      });
    });

    this.write(
      operation,
      'incident.errors.generic',
      (incident) => {
        this.notify({
          recipientRole: 'ROLE_WAREHOUSE_OPERATOR',
          type: 'INCIDENT',
          title: 'Incident resolved',
          message: `The incident on dispatch to ${incident.destinationName} was resolved.`,
        });
        this.refresh();
      },
      { key: 'incident.dashboard.resolved' },
    );
  }

  /**
   * Creates an alert rule.
   *
   * @param command - Command containing the rule definition
   */
  createRule(command: CreateAlertRuleCommand): void {
    const operation = defer(() => {
      if (!(command.threshold > 0)) {
        return throwError(() => new BusinessError('incident.errors.threshold-invalid'));
      }
      return this.api.createRule({ ...command, description: command.description.trim(), active: true });
    });

    this.write(operation, 'incident.errors.generic', () => this.refresh(), {
      key: 'incident.rules.saved',
    });
  }

  /**
   * Enables or disables an alert rule.
   *
   * @param id - Identifier of the rule
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
