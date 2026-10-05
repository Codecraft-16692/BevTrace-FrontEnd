import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { DispatchStore } from '../../../application/dispatch.store';
import { IamStore } from '../../../../iam/application/iam.store';
import { RoutePlanner } from '../../../../traceability/domain/model/route-planner';
import { MapRoute } from '../../../../shared/domain/model/map-route';
import { MessageBanner } from '../../../../shared/presentation/components/message-banner/message-banner';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';
import { RouteCanvas } from '../../../../shared/presentation/components/route-canvas/route-canvas';

/**
 * Component that classifies, authorizes and releases a dispatch order.
 *
 * @remarks
 * This presentation component follows the "Dispatch Classification" wireframe.
 * It shows the shipment data, lets the manager choose the operational priority
 * and assign a vehicle (which authorizes the dispatch), and lets the warehouse
 * operator validate the loaded pallets and register the departure.
 */
@Component({
  selector: 'app-dispatch-detail',
  standalone: true,
  imports: [
    DecimalPipe,
    TranslateModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MessageBanner,
    StatusChip,
    RouteCanvas,
  ],
  templateUrl: './dispatch-detail.html',
  styleUrl: './dispatch-detail.css',
})
export class DispatchDetail implements OnInit {
  /**
   * Store that manages dispatch state.
   */
  protected readonly store = inject(DispatchStore);

  /**
   * Store that exposes the signed in user.
   */
  protected readonly iamStore = inject(IamStore);

  /**
   * Route that exposes the identifier of the order.
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Router used to navigate to related views.
   */
  private readonly router = inject(Router);

  /**
   * Priorities offered in the classification panel.
   */
  protected readonly priorities = ['STANDARD', 'LOGISTICS', 'URGENT'] as const;

  /**
   * Identifier of the order shown by the view.
   */
  protected readonly orderId = signal<number>(0);

  /**
   * Identifier of the vehicle selected for assignment.
   */
  protected readonly vehicleId = signal<number | null>(null);

  /**
   * Pallet labels typed or scanned by the operator, one per line.
   */
  protected readonly palletText = signal<string>('');

  /**
   * Order shown by the view.
   */
  protected readonly order = computed(() => this.store.orderById(this.orderId()));

  /**
   * Cargo assignments of the order.
   */
  protected readonly cargo = computed(() => this.store.cargoOf(this.orderId()));

  /**
   * Pallet labels expected by the order.
   */
  protected readonly expectedPallets = computed(() => this.cargo().flatMap((item) => item.palletCodes));

  /**
   * Destination of the order with its address.
   */
  protected readonly destination = computed(() =>
    this.store.destinations().find((item) => item.id === this.order()?.destinationId),
  );

  /**
   * Suggested route drawn in the map.
   */
  protected readonly suggestedRoute = computed<MapRoute[]>(() => {
    const destination = this.destination();
    if (!destination) return [];
    const points = RoutePlanner.plan(destination.clientName, destination.latitude, destination.longitude);
    return [
      {
        id: this.orderId(),
        label: destination.clientName,
        color: '#0d5c63',
        vehicle: null,
        points: points.map((point) => ({
          latitude: point.latitude,
          longitude: point.longitude,
          label: point.locationName,
          status: 'PENDING' as const,
        })),
      },
    ];
  });

  /**
   * Estimated travel minutes of the suggested route.
   */
  protected readonly estimatedMinutes = computed(() => {
    const destination = this.destination();
    return destination ? RoutePlanner.estimateMinutes(destination.latitude, destination.longitude) : 0;
  });

  /**
   * Indicates whether the current user can classify and assign vehicles.
   */
  protected readonly canManage = computed(() => this.iamStore.hasAnyRole(['ROLE_LOGISTICS_MANAGER']));

  /**
   * Indicates whether the current user can validate pallets and register departures.
   */
  protected readonly canOperate = computed(() => this.iamStore.hasAnyRole(['ROLE_WAREHOUSE_OPERATOR']));

  /**
   * Lifecycle hook that loads the dispatch data and reads the order identifier.
   */
  ngOnInit(): void {
    this.orderId.set(Number(this.route.snapshot.paramMap.get('id')));
    this.store.loadAll();
  }

  /**
   * Changes the operational priority of the order.
   *
   * @param priority - Priority selected by the manager
   */
  protected onPriority(priority: (typeof this.priorities)[number]): void {
    if (!this.canManage() || this.order()?.priority === priority) return;
    this.store.changePriority({ dispatchOrderId: this.orderId(), priority });
  }

  /**
   * Stores the vehicle chosen in the selector.
   *
   * @param value - Identifier typed in the select, empty when nothing is selected
   */
  protected onVehicleChange(value: string): void {
    this.vehicleId.set(value ? Number(value) : null);
  }

  /**
   * Assigns the selected vehicle to the order.
   */
  protected onAssign(): void {
    const vehicleId = this.vehicleId();
    if (vehicleId === null) return;
    this.store.assignVehicle({ dispatchOrderId: this.orderId(), vehicleId });
  }

  /**
   * Fills the scan box with every expected pallet, as a bulk scanner would do.
   */
  protected simulateScan(): void {
    this.palletText.set(this.expectedPallets().join('\n'));
  }

  /**
   * Fills the scan box with the expected pallets plus one that is not in the order.
   */
  protected simulateWrongScan(): void {
    this.palletText.set([...this.expectedPallets(), 'LT-9999-P1'].join('\n'));
  }

  /**
   * Validates the pallets typed in the scan box.
   */
  protected onValidate(): void {
    const scanned = this.palletText()
      .split(/[\n,; ]+/)
      .filter((code) => code.trim().length > 0);
    this.store.validateCargo({ dispatchOrderId: this.orderId(), scannedPallets: scanned });
  }

  /**
   * Registers the departure of the dispatch.
   */
  protected onDepart(): void {
    this.store.registerDeparture({ dispatchOrderId: this.orderId() });
  }

  /**
   * Cancels the dispatch.
   */
  protected onCancel(): void {
    this.store.cancelOrder(this.orderId());
  }

  /**
   * Opens the route tracking map.
   */
  protected openTracking(): void {
    this.router.navigate(['/traceability/route-map']).then();
  }

  /**
   * Returns to the dispatch queue.
   */
  protected back(): void {
    this.router.navigate(['/dispatch/queue']).then();
  }
}
