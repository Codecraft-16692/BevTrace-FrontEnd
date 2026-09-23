import { Component, computed, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Component that renders a translated status as a colored chip.
 *
 * @remarks
 * Every enumerated status of the platform (dispatch, batch, incident, device,
 * subscription...) shares the translation namespace `status.*`. The chip
 * color is resolved from the semantic meaning of the status.
 */
@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './status-chip.html',
  styleUrl: './status-chip.css',
})
export class StatusChip {
  /**
   * Status code to render, for example IN_TRANSIT.
   */
  readonly status = input.required<string>();

  /**
   * CSS class resolved from the status semantics.
   */
  protected readonly cssClass = computed(() => {
    const status = this.status();
    if (OK.includes(status)) return 'chip chip-ok';
    if (WARN.includes(status)) return 'chip chip-warn';
    if (ERROR.includes(status)) return 'chip chip-error';
    if (INFO.includes(status)) return 'chip chip-info';
    return 'chip chip-neutral';
  });
}

/**
 * Statuses that represent a successful or healthy state.
 */
const OK = ['AVAILABLE', 'RECONCILED', 'DELIVERED', 'COMPLETED', 'CONNECTED', 'ACTIVE', 'PAID', 'RESOLVED', 'REACHED', 'LOW'];

/**
 * Statuses that represent a pending or attention state.
 */
const WARN = ['IN_REVIEW', 'SCHEDULED', 'PENDING', 'EXPECTED', 'MEDIUM', 'ACKNOWLEDGED', 'ON_LEAVE'];

/**
 * Statuses that represent a failure or critical state.
 */
const ERROR = ['OPEN', 'CRITICAL', 'HIGH', 'DISCONNECTED', 'FAILED', 'PAST_DUE', 'DELIVERY_REJECTED', 'OMITTED', 'URGENT', 'CANCELLED', 'REJECTED', 'UNAVAILABLE'];

/**
 * Statuses that represent an in-progress state.
 */
const INFO = ['AUTHORIZED', 'IN_TRANSIT', 'LOGISTICS'];
