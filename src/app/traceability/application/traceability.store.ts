import { computed, inject, Injectable, signal } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';

import { BaseStore } from '../../shared/application/base-store';
import { BusinessError } from '../../shared/domain/model/business-error';

import { TraceabilityLog } from '../domain/model/traceability-log.entity';
import { RouteCheckpoint } from '../domain/model/route-checkpoint.entity';
import { DeliveryRecord } from '../domain/model/delivery-record.entity';
import { FinalizeDeliveryCommand } from '../domain/model/finalize-delivery.command';
import { RejectDeliveryCommand } from '../domain/model/reject-delivery.command';

import { TraceabilityApi } from '../infrastructure/traceability-api';

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
   * Confirms the delivery. The backend closes the checkpoint, the record, the log,
   * the dispatch order and releases the vehicle atomically.
   *
   * @param command - Delivery confirmation command
   */
  finalizeDelivery(command: FinalizeDeliveryCommand): void {
    if (command.receivedBy.trim().length < 3) {
      this.startOperation();
      this.failOperation(new BusinessError('traceability.errors.receiver-required'), '');
      return;
    }

    this.write(
      this.api.confirmDelivery(command.logId, command.receivedBy.trim()),
      'traceability.errors.generic',
      () => this.reload(),
      { key: 'traceability.detail.delivered' },
    );
  }

  /**
   * Rejects the delivery. The shipment stays open for a new attempt.
   *
   * @param command - Delivery rejection command
   */
  rejectDelivery(command: RejectDeliveryCommand): void {
    if (command.reason.trim().length < 5) {
      this.startOperation();
      this.failOperation(new BusinessError('traceability.errors.reason-required'), '');
      return;
    }

    this.write(
      this.api.rejectDelivery(command.logId, command.reason.trim()),
      'traceability.errors.generic',
      () => this.reload(),
      { key: 'traceability.detail.rejected' },
    );
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
}
