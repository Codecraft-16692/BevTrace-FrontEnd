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

import { CreateTraceabilityLogRequest } from './traceability-log.request';
import { CreateRouteCheckpointRequest } from './route-checkpoint.request';
import { CreateDeliveryRecordRequest } from './delivery-record.request';

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
   * Retrieves the logs of a dispatch order.
   *
   * @param dispatchOrderId - Identifier of the dispatch order
   * @returns Observable stream emitting the matching TraceabilityLog entities
   */
  findLogsByOrder(dispatchOrderId: number): Observable<TraceabilityLog[]> {
    return this.logEndpoint.getByQuery({ dispatchOrderId });
  }

  /**
   * Creates a traceability log.
   *
   * @param request - Log creation payload
   * @returns Observable stream emitting the created TraceabilityLog
   */
  createLog(request: CreateTraceabilityLogRequest): Observable<TraceabilityLog> {
    return this.logEndpoint.createFromRequest(request);
  }

  /**
   * Partially updates a traceability log.
   *
   * @param id - Identifier of the log
   * @param changes - Fields to change
   * @returns Observable stream emitting the updated TraceabilityLog
   */
  updateLog(
    id: number,
    changes: Partial<
      Pick<
        TraceabilityLog,
        'currentStatus' | 'endTime' | 'currentLatitude' | 'currentLongitude' | 'rejectionReason'
      >
    >,
  ): Observable<TraceabilityLog> {
    return this.logEndpoint.patch(id, changes);
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
   * Creates a route checkpoint.
   *
   * @param request - Checkpoint creation payload
   * @returns Observable stream emitting the created RouteCheckpoint
   */
  createCheckpoint(request: CreateRouteCheckpointRequest): Observable<RouteCheckpoint> {
    return this.checkpointEndpoint.createFromRequest(request);
  }

  /**
   * Partially updates a route checkpoint.
   *
   * @param id - Identifier of the checkpoint
   * @param changes - Fields to change
   * @returns Observable stream emitting the updated RouteCheckpoint
   */
  updateCheckpoint(
    id: number,
    changes: Partial<Pick<RouteCheckpoint, 'status' | 'reachedAt' | 'observation'>>,
  ): Observable<RouteCheckpoint> {
    return this.checkpointEndpoint.patch(id, changes);
  }

  /**
   * Retrieves every delivery record.
   *
   * @returns Observable stream emitting DeliveryRecord entities
   */
  getDeliveryRecords(): Observable<DeliveryRecord[]> {
    return this.recordEndpoint.getAll();
  }

  /**
   * Creates a delivery record.
   *
   * @param request - Delivery record creation payload
   * @returns Observable stream emitting the created DeliveryRecord
   */
  createDeliveryRecord(request: CreateDeliveryRecordRequest): Observable<DeliveryRecord> {
    return this.recordEndpoint.createFromRequest(request);
  }
}
