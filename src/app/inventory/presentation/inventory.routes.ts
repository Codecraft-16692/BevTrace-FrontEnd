import { Routes } from '@angular/router';
import { roleGuard } from '../../iam/infrastructure/role-guard';

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
 * Lazy loads the product registration form view component.
 *
 * @returns A Promise that resolves to the ProductForm component
 */
const productForm = () => import('./views/product-form/product-form').then((m) => m.ProductForm);

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
 * Every path names a plural resource (`/products`, `/batches`, `/waste-records`,
 * `/reconciliations`). Adding products and registering (announcing) batches is reserved to logistics
 * managers; the warehouse operators enter the batches (`/batches`) by scanning them. These routes are mounted by the root configuration
 * inside the main Layout, which already requires an authenticated session.
 */
export const inventoryRoutes: Routes = [
  { path: 'products', loadComponent: inventoryCatalog, title: `Products | ${baseTitle}` },
  {
    path: 'products/new',
    loadComponent: productForm,
    canActivate: [roleGuard('ROLE_LOGISTICS_MANAGER')],
    title: `Register Product | ${baseTitle}`,
  },
  { path: 'batches', loadComponent: batchEntry, title: `Batch Entry | ${baseTitle}` },
  {
    path: 'batches/new',
    loadComponent: batchForm,
    canActivate: [roleGuard('ROLE_LOGISTICS_MANAGER')],
    title: `Register Batch | ${baseTitle}`,
  },
  { path: 'waste-records', loadComponent: wasteManagement, title: `Waste Records | ${baseTitle}` },
  { path: 'reconciliations', loadComponent: reconciliation, title: `Reconciliations | ${baseTitle}` },
  { path: '', redirectTo: 'products', pathMatch: 'full' },
];
