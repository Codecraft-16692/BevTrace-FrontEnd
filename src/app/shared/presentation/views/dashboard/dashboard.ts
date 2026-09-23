import { Component, OnInit, computed, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { IamStore } from '../../../../iam/application/iam.store';
import { InventoryStore } from '../../../../inventory/application/inventory.store';
import { DispatchStore } from '../../../../dispatch/application/dispatch.store';
import { TraceabilityStore } from '../../../../traceability/application/traceability.store';
import { TelemetryStore } from '../../../../telemetry/application/telemetry.store';
import { IncidentStore } from '../../../../incident/application/incident.store';
import { StatusChip } from '../../components/status-chip/status-chip';

/**
 * Component that renders the operations dashboard shown after the sign-in.
 *
 * @remarks
 * This presentation component summarizes every operational bounded context
 * (inventory, dispatch, traceability, telemetry and incidents) with shortcuts
 * to each area, the next dispatches of the queue and the latest incidents.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DatePipe, DecimalPipe, TranslateModule, MatIconModule, StatusChip],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  /**
   * Store that exposes the authenticated session.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Store that manages inventory state.
   */
  protected readonly inventory = inject(InventoryStore);

  /**
   * Store that manages dispatch state.
   */
  protected readonly dispatch = inject(DispatchStore);

  /**
   * Store that manages traceability state.
   */
  protected readonly traceability = inject(TraceabilityStore);

  /**
   * Store that manages telemetry state.
   */
  protected readonly telemetry = inject(TelemetryStore);

  /**
   * Store that manages incident state.
   */
  protected readonly incidents = inject(IncidentStore);

  /**
   * Router used to open the areas of the platform.
   */
  private readonly router = inject(Router);

  /**
   * First name of the signed in user.
   */
  protected readonly firstName = computed(() => (this.iamStore.currentUsername() ?? '').split(' ')[0]);

  /**
   * Next dispatches waiting in the queue.
   */
  protected readonly nextDispatches = computed(() => this.dispatch.queue().slice(0, 5));

  /**
   * Latest incidents that are not resolved.
   */
  protected readonly latestIncidents = computed(() => this.incidents.activeIncidents().slice(0, 5));

  /**
   * Lifecycle hook that loads the summary of every context.
   */
  ngOnInit(): void {
    this.inventory.loadAll();
    this.dispatch.loadAll();
    this.traceability.loadAll();
    this.telemetry.loadAll();
    this.incidents.loadAll();
  }

  /**
   * Opens an area of the platform.
   *
   * @param link - Route to open
   */
  protected go(link: string): void {
    this.router.navigate([link]).then();
  }
}
