import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { ProductBatch } from '../domain/model/product-batch.entity';
import { ProductBatchResource, ProductBatchesResponse } from './product-batch-response';
import { ProductBatchAssembler } from './product-batch-assembler';

const productBatchEndpointUrl = `${environment.serverBasePath}${environment.inventoryBatchesEndpointPath}`;

/**
 * HTTP endpoint client for a batch of beverage products.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class ProductBatchApiEndpoint extends BaseApiEndpoint<
  ProductBatch,
  ProductBatchResource,
  ProductBatchesResponse,
  ProductBatchAssembler
> {
  /**
   * Creates a new ProductBatchApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, productBatchEndpointUrl, new ProductBatchAssembler());
    this.expansions = ['product', 'zone'];
  }
}
