import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { WarehouseZone } from '../domain/model/warehouse-zone.entity';
import { WarehouseZoneResource, WarehouseZonesResponse } from './warehouse-zone-response';
import { WarehouseZoneAssembler } from './warehouse-zone-assembler';

const warehouseZoneEndpointUrl = `${environment.serverBasePath}${environment.inventoryZonesEndpointPath}`;

/**
 * HTTP endpoint client for a physical warehouse zone.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class WarehouseZoneApiEndpoint extends BaseApiEndpoint<
  WarehouseZone,
  WarehouseZoneResource,
  WarehouseZonesResponse,
  WarehouseZoneAssembler
> {
  /**
   * Creates a new WarehouseZoneApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, warehouseZoneEndpointUrl, new WarehouseZoneAssembler());
  }
}
