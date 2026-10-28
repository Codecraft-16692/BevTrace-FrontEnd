import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TraceabilityStore } from '../../../application/traceability.store';
import { autoRefresh } from '../../../../shared/application/auto-refresh';
import { MapRoute } from '../../../../shared/domain/model/map-route';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';
import { RouteCanvas } from '../../../../shared/presentation/components/route-canvas/route-canvas';

/**
 * Component that shows the traceability of one shipment and closes its delivery.
 *
 * @remarks
 * This presentation component supports the checkpoint and delivery user
 * stories. The position and the checkpoints are read-only data supplied by the
 * backend and reloaded periodically. At the destination the operator confirms
 * the delivery or registers a rejection with its reason.
 */
@Component({
  selector: 'app-traceability-detail',
  standalone: true,
  imports: [
    DatePipe,
    TranslateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MessageBanner,
    StatusChip,
    RouteCanvas,
  ],
  templateUrl: './traceability-detail.html',
  styleUrl: './traceability-detail.css',
})
export class TraceabilityDetail implements OnInit {
  /**
   * Store that manages traceability state.
   */
  protected readonly store = inject(TraceabilityStore);

  /**
   * Route that exposes the identifier of the log.
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Router used to navigate to related views.
   */
  private readonly router = inject(Router);

  /**
   * Identifier of the log shown by the view.
   */
  protected readonly logId = signal<number>(0);

  /**
   * Name typed for the person who receives the delivery.
   */
  protected readonly receivedBy = signal<string>('');

  /**
   * Reason typed for a rejected delivery.
   */
  protected readonly rejectionReason = signal<string>('');

  /**
   * Log shown by the view.
   */
  protected readonly log = computed(() => {
    this.store.activeLogs();
    this.store.completedLogs();
    return this.store.logById(this.logId());
  });

  /**
   * Checkpoints of the log ordered by sequence.
   */
  protected readonly checkpoints = computed(() => this.store.checkpointsOf(this.logId()));

  /**
   * Route drawn in the map.
   */
  protected readonly mapRoute = computed<MapRoute[]>(() => {
    const log = this.log();
    if (!log) return [];
    return [
      {
        id: log.id,
        label: `${log.vehiclePlate} → ${log.destinationName}`,
        color: '#0d5c63',
        vehicle: log.currentStatus === 'COMPLETED' ? null : { latitude: log.currentLatitude, longitude: log.currentLongitude },
        points: this.checkpoints().map((checkpoint) => ({
          latitude: checkpoint.latitude,
          longitude: checkpoint.longitude,
          label: checkpoint.locationName,
          status: checkpoint.status,
        })),
      },
    ];
  });

  /**
   * Keeps the shipment up to date by reloading the data periodically.
   */
  constructor() {
    autoRefresh(() => this.store.reload());
  }

  /**
   * Lifecycle hook that loads the traceability data and reads the log identifier.
   */
  ngOnInit(): void {
    this.logId.set(Number(this.route.snapshot.paramMap.get('id')));
    this.store.loadAll();
  }

  /**
   * Reloads the traceability data from the API.
   */
  protected onRefresh(): void {
    this.store.loadAll();
  }

  /**
   * Confirms the delivery with the typed receiver.
   */
  protected onDeliver(): void {
    this.store.finalizeDelivery({ logId: this.logId(), receivedBy: this.receivedBy() });
  }

  /**
   * Registers a rejection with the typed reason.
   */
  protected onReject(): void {
    this.store.rejectDelivery({ logId: this.logId(), reason: this.rejectionReason() });
  }

  /**
   * Returns to the route map.
   */
  protected back(): void {
    this.router.navigate(['/traceability/logs']).then();
  }
}
