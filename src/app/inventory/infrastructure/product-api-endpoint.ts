import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Product } from '../domain/model/product.entity';
import { ProductResource, ProductsResponse } from './product-response';
import { ProductAssembler } from './product-assembler';

const productEndpointUrl = `${environment.serverBasePath}${environment.inventoryProductsEndpointPath}`;

/**
 * HTTP endpoint client for a beverage product (SKU).
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class ProductApiEndpoint extends BaseApiEndpoint<
  Product,
  ProductResource,
  ProductsResponse,
  ProductAssembler
> {
  /**
   * Creates a new ProductApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, productEndpointUrl, new ProductAssembler());
  }
}
