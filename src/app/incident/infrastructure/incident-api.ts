import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';

import { AlertRule } from '../domain/model/alert-rule.entity';
import { IncidentRecord } from '../domain/model/incident-record.entity';
import { CorrectiveAction } from '../domain/model/corrective-action.entity';
import { Notification } from '../domain/model/notification.entity';

import { AlertRuleApiEndpoint } from './alert-rule-api-endpoint';
import { IncidentRecordApiEndpoint } from './incident-record-api-endpoint';
import { CorrectiveActionApiEndpoint } from './corrective-action-api-endpoint';
import { NotificationApiEndpoint } from './notification-api-endpoint';

import { CreateAlertRuleRequest } from './alert-rule.request';

/**
 * HTTP API facade for the Incident bounded context.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over alert rule, incident,
 * corrective action and notification endpoint clients.
 */
@Injectable({ providedIn: 'root' })
export class IncidentApi extends BaseApi {
  /**
   * Endpoint client for alert rules.
   */
  private readonly ruleEndpoint: AlertRuleApiEndpoint;

  /**
   * Endpoint client for incident records.
   */
  private readonly incidentEndpoint: IncidentRecordApiEndpoint;

  /**
   * Endpoint client for corrective actions.
   */
  private readonly actionEndpoint: CorrectiveActionApiEndpoint;

  /**
   * Endpoint client for notifications.
   */
  private readonly notificationEndpoint: NotificationApiEndpoint;

  /**
   * Creates a new IncidentApi facade.
   *
   * @param http - Angular HttpClient used by endpoint clients
   */
  constructor(http: HttpClient) {
    super();
    this.ruleEndpoint = new AlertRuleApiEndpoint(http);
    this.incidentEndpoint = new IncidentRecordApiEndpoint(http);
    this.actionEndpoint = new CorrectiveActionApiEndpoint(http);
    this.notificationEndpoint = new NotificationApiEndpoint(http);
  }

  /**
   * Retrieves every alert rule.
   *
   * @returns Observable stream emitting AlertRule entities
   */
  getRules(): Observable<AlertRule[]> {
    return this.ruleEndpoint.getAll();
  }

  /**
   * Creates an alert rule.
   *
   * @param request - Rule creation payload
   * @returns Observable stream emitting the created AlertRule
   */
  createRule(request: CreateAlertRuleRequest): Observable<AlertRule> {
    return this.ruleEndpoint.createFromRequest(request);
  }

  /**
   * Enables or disables a rule (PATCH /rules/{id}/active).
   *
   * @param id     - Rule identifier
   * @param active - New activation state
   * @returns Observable completing when the rule was updated
   */
  setRuleActive(id: number, active: boolean): Observable<void> {
    return this.ruleEndpoint.command('PATCH', `${id}/active`, { active });
  }

  /**
   * Retrieves every incident.
   *
   * @returns Observable stream emitting IncidentRecord entities
   */
  getIncidents(): Observable<IncidentRecord[]> {
    return this.incidentEndpoint.getAll();
  }

  /**
   * Runs the anomaly detection (POST /incidents/detections).
   *
   * @returns Observable emitting how many incidents were created and reopened
   */
  detectAnomalies(): Observable<{ created: number; reopened: number }> {
    return this.incidentEndpoint.detect();
  }

  /**
   * Acknowledges an incident (POST /incidents/{id}/acknowledgement).
   *
   * @param id - Incident identifier
   * @returns Observable completing when it was acknowledged
   */
  acknowledgeIncident(id: number): Observable<void> {
    return this.incidentEndpoint.command('POST', `${id}/acknowledgement`);
  }

  /**
   * Registers a corrective action (POST /incidents/{id}/corrective-actions).
   *
   * @param id          - Incident identifier
   * @param description - What was done
   * @returns Observable completing when the action was registered
   */
  registerCorrectiveAction(id: number, description: string): Observable<void> {
    return this.incidentEndpoint.command('POST', `${id}/corrective-actions`, { description });
  }

  /**
   * Resolves an incident (POST /incidents/{id}/resolution).
   *
   * @param id - Incident identifier
   * @returns Observable completing when it was resolved
   */
  resolveIncident(id: number): Observable<void> {
    return this.incidentEndpoint.command('POST', `${id}/resolution`);
  }

  /**
   * Retrieves every corrective action.
   *
   * @returns Observable stream emitting CorrectiveAction entities
   */
  getActions(): Observable<CorrectiveAction[]> {
    return this.actionEndpoint.getAll();
  }


  /**
   * Retrieves every notification.
   *
   * @returns Observable stream emitting Notification entities
   */
  getNotifications(): Observable<Notification[]> {
    return this.notificationEndpoint.getAll();
  }


  /**
   * Marks a notification as read (PATCH /notifications/{id}/read).
   *
   * @param id - Notification identifier
   * @returns Observable completing when it was marked
   */
  markNotificationRead(id: number): Observable<void> {
    return this.notificationEndpoint.command('PATCH', `${id}/read`);
  }
}
