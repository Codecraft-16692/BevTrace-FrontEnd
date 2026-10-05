import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { TraceabilityStore } from '../../../application/traceability.store';
import { MapRoute } from '../../../../shared/domain/model/map-route';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';
import { RouteCanvas } from '../../../../shared/presentation/components/route-canvas/route-canvas';

/**
 * Colors assigned to the routes drawn in the map.
 */
const PALETTE = ['#0d5c63', '#e07b00', '#6a1b9a', '#1565c0', '#c62828', '#2e7d32'];

/**
 * Component that renders the active route traceability map.
 *
 * @remarks
 * This presentation component follows the "Active Route Traceability Map"
 * wireframe. It lists the shipments on the road, draws their routes and
 * checkpoints in a schematic map and shows the detailed traceability log with
 * the progress of every shipment.
 */
@Component({
  selector: 'app-route-map',
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
  templateUrl: './route-map.html',
  styleUrl: './route-map.css',
})
export class RouteMap implements OnInit {
  /**
   * Store that manages traceability state.
   */
  protected readonly store = inject(TraceabilityStore);

  /**
   * Router used to open the traceability detail.
   */
  private readonly router = inject(Router);

  /**
   * Identifier of the highlighted route.
   */
  protected readonly selectedId = signal<number | null>(null);

  /**
   * Routes drawn in the map.
   */
  protected readonly routes = computed<MapRoute[]>(() =>
    this.store.activeLogs().map((log, index) => ({
      id: log.id,
      label: `${log.vehiclePlate} → ${log.destinationName}`,
      color: PALETTE[index % PALETTE.length],
      vehicle: { latitude: log.currentLatitude, longitude: log.currentLongitude },
      points: this.store.checkpointsOf(log.id).map((checkpoint) => ({
        latitude: checkpoint.latitude,
        longitude: checkpoint.longitude,
        label: checkpoint.locationName,
        status: checkpoint.status,
      })),
    })),
  );

  /**
   * Lifecycle hook that loads the traceability data.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Selects a route in the map or in the list.
   *
   * @param id - Identifier of the traceability log
   */
  protected select(id: number): void {
    this.selectedId.set(id);
  }

  /**
   * Calculates the percentage of checkpoints already reached.
   *
   * @param logId - Identifier of the traceability log
   * @returns Progress between 0 and 100
   */
  protected progress(logId: number): number {
    const route = this.store.checkpointsOf(logId);
    if (route.length === 0) return 0;
    return Math.round((route.filter((checkpoint) => checkpoint.status !== 'PENDING').length / route.length) * 100);
  }

  /**
   * Returns the color of a route.
   *
   * @param index - Position of the route in the list
   * @returns CSS color
   */
  protected colorOf(index: number): string {
    return PALETTE[index % PALETTE.length];
  }

  /**
   * Opens the detail of a traceability log.
   *
   * @param logId - Identifier of the traceability log
   */
  protected open(logId: number): void {
    this.router.navigate(['/traceability/log', logId]).then();
  }
}
