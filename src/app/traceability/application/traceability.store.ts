import { computed, inject, Injectable, Injector, signal } from '@angular/core';
import { defer, forkJoin, map, Observable, of, switchMap, throwError } from 'rxjs';

import { BaseStore } from '../../shared/application/base-store';
import { BusinessError } from '../../shared/domain/model/business-error';

import { TraceabilityLog } from '../domain/model/traceability-log.entity';
import { RouteCheckpoint } from '../domain/model/route-checkpoint.entity';
import { DeliveryRecord } from '../domain/model/delivery-record.entity';
import { RoutePlanner, ORIGIN } from '../domain/model/route-planner';
import { StartRouteTraceabilityCommand } from '../domain/model/start-route-traceability.command';
import { FinalizeDeliveryCommand } from '../domain/model/finalize-delivery.command';
import { RejectDeliveryCommand } from '../domain/model/reject-delivery.command';

import { TraceabilityApi } from '../infrastructure/traceability-api';
import { TelemetryApi } from '../../telemetry/infrastructure/telemetry-api';
import { DispatchStore } from '../../dispatch/application/dispatch.store';
import { IncidentStore } from '../../incident/application/incident.store';

/**
 * Signal-based application store for the Traceability bounded context.
 *
 * @remarks
 * This store manages the route traceability of the shipments: it starts the
 * traceability when a dispatch departs and finalizes or rejects the delivery.
 * The vehicle position and the intermediate checkpoints come from the
 * tracking backend and are only read. The completion of a delivery closes the
 * dispatch order automatically.
 */
@Injectable({ providedIn: 'root' })
export class TraceabilityStore extends BaseStore {
  /**
   * API facade used to reach the traceability endpoints.
   */
  private readonly api = inject(TraceabilityApi);

  /**
   * API facade used to find the device installed in a vehicle.
   */
  private readonly telemetryApi = inject(TelemetryApi);

  /**
   * Injector used to reach other bounded contexts lazily.
   */
  private readonly injector = inject(Injector);

  /**
   * Internal signal containing the traceability logs.
   */
  private readonly logsSignal = signal<TraceabilityLog[]>([]);

  /**
   * Internal signal containing the route checkpoints.
   */
  private readonly checkpointsSignal = signal<RouteCheckpoint[]>([]);

  /**
   * Internal signal containing the delivery records.
   */
  private readonly recordsSignal = signal<DeliveryRecord[]>([]);

  /**
   * Readonly signal exposing the route checkpoints.
   */
  readonly checkpoints = this.checkpointsSignal.asReadonly();

  /**
   * Readonly signal exposing the delivery records, newest first.
   */
  readonly records = computed(() =>
    [...this.recordsSignal()].sort((a, b) => b.deliveredAt.localeCompare(a.deliveredAt)),
  );

  /**
   * Shipments that are still on the road or waiting for a delivery decision.
   */
  readonly activeLogs = computed(() =>
    this.logsSignal().filter((log) => log.currentStatus !== 'COMPLETED'),
  );

  /**
   * Shipments already delivered, newest first.
   */
  readonly completedLogs = computed(() =>
    this.logsSignal()
      .filter((log) => log.currentStatus === 'COMPLETED')
      .sort((a, b) => (b.endTime ?? '').localeCompare(a.endTime ?? '')),
  );

  /**
   * Loads every traceability collection.
   */
  loadAll(): void {
    this.read(this.snapshot$(), 'traceability.errors.load', (snapshot) => this.applySnapshot(snapshot));
  }

  /**
   * Returns a log by identifier.
   *
   * @param logId - Identifier of the log
   * @returns The matching log or undefined
   */
  logById(logId: number): TraceabilityLog | undefined {
    return this.logsSignal().find((log) => log.id === logId);
  }

  /**
   * Returns the checkpoints of a log ordered by sequence.
   *
   * @param logId - Identifier of the log
   * @returns Ordered route checkpoints
   */
  checkpointsOf(logId: number): RouteCheckpoint[] {
    return this.checkpointsSignal()
      .filter((checkpoint) => checkpoint.logId === logId)
      .sort((a, b) => a.sequence - b.sequence);
  }

  /**
   * Returns the delivery records of a log, newest first.
   *
   * @param logId - Identifier of the log
   * @returns Delivery records of the log
   */
  recordsOf(logId: number): DeliveryRecord[] {
    return this.records().filter((record) => record.logId === logId);
  }

  /**
   * Starts the traceability of a departed dispatch.
   *
   * @remarks
   * Returns an observable so the dispatch store can chain it after registering
   * the departure. When a log already exists for the order it is reused.
   *
   * @param command - Command containing the departure snapshot
   * @returns Observable emitting the traceability log
   */
  startRouteTraceability(command: StartRouteTraceabilityCommand): Observable<TraceabilityLog> {
    return this.api.findLogsByOrder(command.dispatchOrderId).pipe(
      switchMap((existing) => {
        if (existing.length > 0) return of(existing[0]);

        const points = RoutePlanner.plan(
          command.destinationName,
          command.destinationLatitude,
          command.destinationLongitude,
        );
        const minutes = RoutePlanner.estimateMinutes(
          command.destinationLatitude,
          command.destinationLongitude,
        );

        return this.telemetryApi.getDevices().pipe(
          switchMap((devices) =>
            this.api.createLog({
              dispatchOrderId: command.dispatchOrderId,
              currentStatus: 'IN_TRANSIT',
              startTime: command.departedAt,
              endTime: null,
              estimatedArrival: new Date(new Date(command.departedAt).getTime() + minutes * 60000).toISOString(),
              currentLatitude: ORIGIN.latitude,
              currentLongitude: ORIGIN.longitude,
              rejectionReason: null,
              orderPriority: command.priority,
              destinationName: command.destinationName,
              vehiclePlate: command.vehiclePlate,
              deviceId: devices.find((device) => device.vehicleId === command.vehicleId)?.id ?? null,
            }),
          ),
          switchMap((log) =>
            forkJoin(
              points.map((point) =>
                this.api.createCheckpoint({
                  logId: log.id,
                  sequence: point.sequence,
                  locationName: point.locationName,
                  latitude: point.latitude,
                  longitude: point.longitude,
                  status: point.sequence === 1 ? 'REACHED' : 'PENDING',
                  reachedAt: point.sequence === 1 ? command.departedAt : null,
                  observation: null,
                }),
              ),
            ).pipe(map(() => log)),
          ),
        );
      }),
    );
  }

  /**
   * Confirms the delivery at the destination and closes the dispatch.
   *
   * @param command - Command containing the log and the person who received the cargo
   */
  finalizeDelivery(command: FinalizeDeliveryCommand): void {
    const operation = defer(() => {
      const log = this.logById(command.logId);
      if (!log || log.currentStatus === 'COMPLETED') {
        return throwError(() => new BusinessError('traceability.errors.already-completed'));
      }
      if (command.receivedBy.trim().length < 3) {
        return throwError(() => new BusinessError('traceability.errors.receiver-required'));
      }

      const now = new Date().toISOString();
      return this.markDestinationReached(log.id, now)
        .pipe(switchMap(() => this.api.createDeliveryRecord({
          logId: log.id,
          receivedBy: command.receivedBy.trim(),
          signatureUrl: null,
          deliveredAt: now,
          status: 'DELIVERED',
          rejectionReason: null,
        })))
        .pipe(
          switchMap(() =>
            this.api.updateLog(log.id, { currentStatus: 'COMPLETED', endTime: now, rejectionReason: null }),
          ),
          switchMap(() => this.injector.get(DispatchStore).completeDelivery(log.dispatchOrderId)),
          map(() => log),
        );
    });

    this.write(
      operation,
      'traceability.errors.generic',
      (log) => {
        this.injector.get(IncidentStore).notify({
          recipientRole: 'ROLE_LOGISTICS_MANAGER',
          type: 'DISPATCH',
          title: 'Delivery completed',
          message: `The shipment to ${log.destinationName} was delivered and the dispatch was closed.`,
        });
        this.reload();
      },
      { key: 'traceability.detail.delivered' },
    );
  }

  /**
   * Registers a delivery rejected by the client, keeping the shipment open.
   *
   * @param command - Command containing the log and the rejection reason
   */
  rejectDelivery(command: RejectDeliveryCommand): void {
    const operation = defer(() => {
      const log = this.logById(command.logId);
      if (!log || log.currentStatus === 'COMPLETED') {
        return throwError(() => new BusinessError('traceability.errors.already-completed'));
      }
      if (command.reason.trim().length < 5) {
        return throwError(() => new BusinessError('traceability.errors.reason-required'));
      }

      const now = new Date().toISOString();
      return this.markDestinationReached(log.id, now)
        .pipe(
          switchMap(() =>
            this.api.createDeliveryRecord({
              logId: log.id,
              receivedBy: '-',
              signatureUrl: null,
              deliveredAt: now,
              status: 'REJECTED',
              rejectionReason: command.reason.trim(),
            }),
          ),
          switchMap(() =>
            this.api.updateLog(log.id, {
              currentStatus: 'DELIVERY_REJECTED',
              rejectionReason: command.reason.trim(),
            }),
          ),
        );
    });

    this.write(operation, 'traceability.errors.generic', () => this.reload(), {
      key: 'traceability.detail.rejected',
    });
  }

  /**
   * Builds the observable that retrieves every traceability collection.
   *
   * @returns Observable emitting the whole traceability snapshot
   */
  private snapshot$(): Observable<{
    logs: TraceabilityLog[];
    checkpoints: RouteCheckpoint[];
    records: DeliveryRecord[];
  }> {
    return forkJoin({
      logs: this.api.getLogs(),
      checkpoints: this.api.getCheckpoints(),
      records: this.api.getDeliveryRecords(),
    });
  }

  /**
   * Stores a snapshot in the signals of the store.
   *
   * @param snapshot - Traceability snapshot retrieved from the API
   */
  private applySnapshot(snapshot: {
    logs: TraceabilityLog[];
    checkpoints: RouteCheckpoint[];
    records: DeliveryRecord[];
  }): void {
    this.logsSignal.set(snapshot.logs);
    this.checkpointsSignal.set(snapshot.checkpoints);
    this.recordsSignal.set(snapshot.records);
  }

  /**
   * Reloads the traceability data silently (no loading overlay).
   *
   * @remarks
   * The position and the checkpoints of a shipment are produced by the
   * tracking backend and are only read here; the views call this method to
   * stay up to date.
   */
  reload(): void {
    this.snapshot$().subscribe((snapshot) => this.applySnapshot(snapshot));
  }

  /**
   * Marks the destination checkpoint as reached when the receiver answers the delivery.
   *
   * @param logId - Identifier of the log
   * @param reachedAt - Moment in which the cargo was handed over or rejected
   * @returns Observable that completes once the checkpoint is updated
   */
  private markDestinationReached(logId: number, reachedAt: string): Observable<unknown> {
    const route = this.checkpointsOf(logId);
    const destination = route[route.length - 1];
    if (!destination || destination.status === 'REACHED') return of(null);
    return this.api.updateCheckpoint(destination.id, { status: 'REACHED', reachedAt });
  }
}
