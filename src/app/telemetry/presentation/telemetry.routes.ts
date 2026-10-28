import { Routes } from '@angular/router';
import { roleGuard } from '../../iam/infrastructure/role-guard';

/**
 * Lazy loads the device connectivity panel view component.
 *
 * @returns A Promise that resolves to the DevicePanel component
 */
const devicePanel = () => import('./views/device-panel/device-panel').then((m) => m.DevicePanel);

/**
 * Lazy loads the device provisioning form view component.
 *
 * @returns A Promise that resolves to the DeviceForm component
 */
const deviceForm = () => import('./views/device-form/device-form').then((m) => m.DeviceForm);

/**
 * Base title used by telemetry routes.
 */
const baseTitle = 'BevTrace';

/**
 * Routing configuration for the Telemetry bounded context.
 *
 * @remarks
 * The resource is the plural `devices` (mounted under `/telemetry`). Provisioning a device (`/devices/new`)
 * is reserved to logistics managers.
 */
export const telemetryRoutes: Routes = [
  { path: 'devices', loadComponent: devicePanel, title: `Devices | ${baseTitle}` },
  {
    path: 'devices/new',
    loadComponent: deviceForm,
    canActivate: [roleGuard('ROLE_LOGISTICS_MANAGER')],
    title: `Provision Device | ${baseTitle}`,
  },
  { path: '', redirectTo: 'devices', pathMatch: 'full' },
];
