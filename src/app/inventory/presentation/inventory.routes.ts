import { Routes } from '@angular/router';
import { Layout } from '../../shared/presentation/components/layout/layout';
import { iamGuard } from '../../iam/infrastructure/iam-guard';

/**
 * Lazy loads the inventory catalog view component.
 *
 * @returns A Promise that resolves to the InventoryCatalog component
 */
const inventoryCatalog = () =>
  import('./views/inventory-catalog/inventory-catalog').then((m) => m.InventoryCatalog);

/**
 * Lazy loads the batch entry view component.
 *
 * @returns A Promise that resolves to the BatchEntry component
 */
const batchEntry = () => import('./views/batch-entry/batch-entry').then((m) => m.BatchEntry);

/**
 * Lazy loads the batch registration form view component.
 *
 * @returns A Promise that resolves to the BatchForm component
 */
const batchForm = () => import('./views/batch-form/batch-form').then((m) => m.BatchForm);

/**
 * Lazy loads the waste management view component.
 *
 * @returns A Promise that resolves to the WasteManagement component
 */
const wasteManagement = () =>
  import('./views/waste-management/waste-management').then((m) => m.WasteManagement);

/**
 * Lazy loads the reconciliation view component.
 *
 * @returns A Promise that resolves to the Reconciliation component
 */
const reconciliation = () =>
  import('./views/reconciliation/reconciliation').then((m) => m.Reconciliation);

/**
 * Base title used by inventory routes.
 */
const baseTitle = 'BevTrace';

/**
 * Routing configuration for the Inventory bounded context.
 *
 * @remarks
 * These routes are lazy loaded inside the main Layout and protected by the
 * authentication guard.
 */
export const inventoryRoutes: Routes = [
  {
    path: '',
    component: Layout,
    canActivate: [iamGuard],
    children: [
      { path: 'catalog', loadComponent: inventoryCatalog, title: `Inventory | ${baseTitle}` },
      { path: 'batch-entry', loadComponent: batchEntry, title: `Batch Entry | ${baseTitle}` },
      { path: 'batch-form', loadComponent: batchForm, title: `Register Batch | ${baseTitle}` },
      { path: 'waste', loadComponent: wasteManagement, title: `Waste | ${baseTitle}` },
      { path: 'reconciliation', loadComponent: reconciliation, title: `Reconciliation | ${baseTitle}` },
      { path: '', redirectTo: 'catalog', pathMatch: 'full' },
    ],
  },
];
