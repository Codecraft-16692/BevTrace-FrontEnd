import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { InventoryReconciliation } from '../domain/model/inventory-reconciliation.entity';
import { InventoryReconciliationResource, InventoryReconciliationsResponse } from './inventory-reconciliation-response';
import { InventoryReconciliationAssembler } from './inventory-reconciliation-assembler';

const inventoryReconciliationEndpointUrl = `${environment.serverBasePath}${environment.inventoryReconciliationsEndpointPath}`;

/**
 * HTTP endpoint client for a physical inventory reconciliation.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class InventoryReconciliationApiEndpoint extends BaseApiEndpoint<
  InventoryReconciliation,
  InventoryReconciliationResource,
  InventoryReconciliationsResponse,
  InventoryReconciliationAssembler
> {
  /**
   * Creates a new InventoryReconciliationApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, inventoryReconciliationEndpointUrl, new InventoryReconciliationAssembler());
  }
}
