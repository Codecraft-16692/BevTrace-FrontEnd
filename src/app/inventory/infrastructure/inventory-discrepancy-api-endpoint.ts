import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { InventoryDiscrepancy } from '../domain/model/inventory-discrepancy.entity';
import { InventoryDiscrepancyResource, InventoryDiscrepanciesResponse } from './inventory-discrepancy-response';
import { InventoryDiscrepancyAssembler } from './inventory-discrepancy-assembler';

const inventoryDiscrepancyEndpointUrl = `${environment.serverBasePath}${environment.inventoryDiscrepanciesEndpointPath}`;

/**
 * HTTP endpoint client for an inventory discrepancy.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class InventoryDiscrepancyApiEndpoint extends BaseApiEndpoint<
  InventoryDiscrepancy,
  InventoryDiscrepancyResource,
  InventoryDiscrepanciesResponse,
  InventoryDiscrepancyAssembler
> {
  /**
   * Creates a new InventoryDiscrepancyApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, inventoryDiscrepancyEndpointUrl, new InventoryDiscrepancyAssembler());
    this.expansions = ['batch'];
  }
}
