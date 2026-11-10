import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';

import { TraceabilityLog } from '../domain/model/traceability-log.entity';
import { RouteCheckpoint } from '../domain/model/route-checkpoint.entity';
import { DeliveryRecord } from '../domain/model/delivery-record.entity';

import { TraceabilityLogApiEndpoint } from './traceability-log-api-endpoint';
import { RouteCheckpointApiEndpoint } from './route-checkpoint-api-endpoint';
import { DeliveryRecordApiEndpoint } from './delivery-record-api-endpoint';


/**
 * HTTP API facade for the Traceability bounded context.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over traceability log, route
 * checkpoint and delivery record endpoint clients.
 */
@Injectable({ providedIn: 'root' })
export class TraceabilityApi extends BaseApi {
  /**
   * Endpoint client for traceability logs.
   */
  private readonly logEndpoint: TraceabilityLogApiEndpoint;

  /**
   * Endpoint client for route checkpoints.
   */
  private readonly checkpointEndpoint: RouteCheckpointApiEndpoint;

  /**
   * Endpoint client for delivery records.
   */
  private readonly recordEndpoint: DeliveryRecordApiEndpoint;

  /**
   * Creates a new TraceabilityApi facade.
   *
   * @param http - Angular HttpClient used by endpoint clients
   */
  constructor(http: HttpClient) {
    super();
    this.logEndpoint = new TraceabilityLogApiEndpoint(http);
    this.checkpointEndpoint = new RouteCheckpointApiEndpoint(http);
    this.recordEndpoint = new DeliveryRecordApiEndpoint(http);
  }

  /**
   * Retrieves every traceability log.
   *
   * @returns Observable stream emitting TraceabilityLog entities
   */
  getLogs(): Observable<TraceabilityLog[]> {
    return this.logEndpoint.getAll();
  }



  /**
   * Confirms the delivery (POST /logs/{id}/delivery).
   *
   * @param id         - Log identifier
   * @param receivedBy - Name of the person who received the cargo
   * @returns Observable completing when the delivery was confirmed
   */
  confirmDelivery(id: number, receivedBy: string): Observable<void> {
    return this.logEndpoint.command('POST', `${id}/delivery`, { receivedBy });
  }

  /**
   * Rejects the delivery (POST /logs/{id}/rejection).
   *
   * @param id     - Log identifier
   * @param reason - Rejection reason
   * @returns Observable completing when the rejection was registered
   */
  rejectDelivery(id: number, reason: string): Observable<void> {
    return this.logEndpoint.command('POST', `${id}/rejection`, { reason });
  }

  /**
   * Retrieves every route checkpoint.
   *
   * @returns Observable stream emitting RouteCheckpoint entities
   */
  getCheckpoints(): Observable<RouteCheckpoint[]> {
    return this.checkpointEndpoint.getAll();
  }



  /**
   * Retrieves every delivery record.
   *
   * @returns Observable stream emitting DeliveryRecord entities
   */
  getDeliveryRecords(): Observable<DeliveryRecord[]> {
    return this.recordEndpoint.getAll();
  }

}
