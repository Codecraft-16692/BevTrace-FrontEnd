import { Routes } from '@angular/router';

/**
 * Lazy loads the active route map view component.
 *
 * @returns A Promise that resolves to the RouteMap component
 */
const routeMap = () => import('./views/route-map/route-map').then((m) => m.RouteMap);

/**
 * Lazy loads the traceability detail view component.
 *
 * @returns A Promise that resolves to the TraceabilityDetail component
 */
const traceabilityDetail = () =>
  import('./views/traceability-detail/traceability-detail').then((m) => m.TraceabilityDetail);

/**
 * Lazy loads the delivery history view component.
 *
 * @returns A Promise that resolves to the DeliveryHistory component
 */
const deliveryHistory = () =>
  import('./views/delivery-history/delivery-history').then((m) => m.DeliveryHistory);

/**
 * Base title used by traceability routes.
 */
const baseTitle = 'BevTrace';

/**
 * Routing configuration for the Traceability bounded context.
 *
 * @remarks
 * `/traceability/logs` is the collection of shipments on the road (rendered as
 * a map), `/traceability/logs/:id` one shipment and `/traceability/delivery-records` the
 * history of closed deliveries.
 */
export const traceabilityRoutes: Routes = [
  { path: 'logs', loadComponent: routeMap, title: `Traceability Logs | ${baseTitle}` },
  { path: 'logs/:id', loadComponent: traceabilityDetail, title: `Traceability Log | ${baseTitle}` },
  { path: 'delivery-records', loadComponent: deliveryHistory, title: `Delivery Records | ${baseTitle}` },
  { path: '', redirectTo: 'logs', pathMatch: 'full' },
];
