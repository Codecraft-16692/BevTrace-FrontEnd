import { DestroyRef, inject } from '@angular/core';
import { interval } from 'rxjs';

/**
 * Default period, in milliseconds, between two automatic reloads of a view.
 */
export const AUTO_REFRESH_MS = 30_000;

/**
 * Reloads the data of a view periodically while the view is alive.
 *
 * @remarks
 * BevTrace does not simulate movement or sensor activity in the browser: the
 * positions, readings and statuses are produced by the backend. The views
 * therefore only show what the API returns and ask for it again at a fixed
 * pace. Must be called from an injection context (constructor or field
 * initializer); the subscription is released when the host is destroyed.
 *
 * @param reload - Function that silently reloads the data of the view
 * @param periodMs - Period between reloads, 30 seconds by default
 */
export function autoRefresh(reload: () => void, periodMs: number = AUTO_REFRESH_MS): void {
  const subscription = interval(periodMs).subscribe(() => reload());
  inject(DestroyRef).onDestroy(() => subscription.unsubscribe());
}
