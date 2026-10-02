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
import { CreateIncidentRecordRequest } from './incident-record.request';
import { CreateCorrectiveActionRequest } from './corrective-action.request';
import { CreateNotificationRequest } from './notification.request';

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
   * Enables or disables an alert rule.
   *
   * @param id - Identifier of the rule
   * @param active - New activation state
   * @returns Observable stream emitting the updated AlertRule
   */
  setRuleActive(id: number, active: boolean): Observable<AlertRule> {
    return this.ruleEndpoint.patch(id, { active });
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
   * Creates an incident.
   *
   * @param request - Incident creation payload
   * @returns Observable stream emitting the created IncidentRecord
   */
  createIncident(request: CreateIncidentRecordRequest): Observable<IncidentRecord> {
    return this.incidentEndpoint.createFromRequest(request);
  }

  /**
   * Partially updates an incident.
   *
   * @param id - Identifier of the incident
   * @param changes - Fields to change
   * @returns Observable stream emitting the updated IncidentRecord
   */
  updateIncident(
    id: number,
    changes: Partial<
      Pick<
        IncidentRecord,
        'status' | 'acknowledgedBy' | 'acknowledgedAt' | 'resolvedAt' | 'reopenCount' | 'detectedAt'
      >
    >,
  ): Observable<IncidentRecord> {
    return this.incidentEndpoint.patch(id, changes);
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
   * Creates a corrective action.
   *
   * @param request - Corrective action creation payload
   * @returns Observable stream emitting the created CorrectiveAction
   */
  createAction(request: CreateCorrectiveActionRequest): Observable<CorrectiveAction> {
    return this.actionEndpoint.createFromRequest(request);
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
   * Creates a notification.
   *
   * @param request - Notification creation payload
   * @returns Observable stream emitting the created Notification
   */
  createNotification(request: CreateNotificationRequest): Observable<Notification> {
    return this.notificationEndpoint.createFromRequest(request);
  }

  /**
   * Marks a notification as read.
   *
   * @param id - Identifier of the notification
   * @returns Observable stream emitting the updated Notification
   */
  markNotificationRead(id: number): Observable<Notification> {
    return this.notificationEndpoint.patch(id, { read: true });
  }
}
