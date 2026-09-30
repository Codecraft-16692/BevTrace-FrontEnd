import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';

import { TraceabilityStore } from '../../../application/traceability.store';
import { StatusChip } from '../../../../shared/presentation/components/status-chip/status-chip';

/**
 * Component that lists the completed shipments and their delivery records.
 *
 * @remarks
 * This presentation component shows the closed traceability logs together with
 * the person who received each delivery, so the team can audit past routes.
 */
@Component({
  selector: 'app-delivery-history',
  standalone: true,
  imports: [DatePipe, TranslateModule, MatIconModule, StatusChip],
  templateUrl: './delivery-history.html',
  styleUrl: './delivery-history.css',
})
export class DeliveryHistory implements OnInit {
  /**
   * Store that manages traceability state.
   */
  protected readonly store = inject(TraceabilityStore);

  /**
   * Router used to open the traceability detail.
   */
  private readonly router = inject(Router);

  /**
   * Lifecycle hook that loads the traceability data.
   */
  ngOnInit(): void {
    this.store.loadAll();
  }

  /**
   * Opens the detail of a traceability log.
   *
   * @param logId - Identifier of the traceability log
   */
  protected open(logId: number): void {
    this.router.navigate(['/traceability/log', logId]).then();
  }

  /**
   * Finds who received the delivery of a log.
   *
   * @param logId - Identifier of the traceability log
   * @returns Name of the receiver or a dash
   */
  protected receiverOf(logId: number): string {
    return this.store.recordsOf(logId).find((record) => record.status === 'DELIVERED')?.receivedBy ?? '-';
  }
}
