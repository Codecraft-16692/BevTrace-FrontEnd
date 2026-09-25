import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';

import { Product } from '../domain/model/product.entity';
import { WarehouseZone } from '../domain/model/warehouse-zone.entity';
import { ProductBatch } from '../domain/model/product-batch.entity';
import { WasteRecord } from '../domain/model/waste-record.entity';
import { InventoryReconciliation } from '../domain/model/inventory-reconciliation.entity';
import { InventoryDiscrepancy } from '../domain/model/inventory-discrepancy.entity';

import { ProductApiEndpoint } from './product-api-endpoint';
import { WarehouseZoneApiEndpoint } from './warehouse-zone-api-endpoint';
import { ProductBatchApiEndpoint } from './product-batch-api-endpoint';
import { WasteRecordApiEndpoint } from './waste-record-api-endpoint';
import { InventoryReconciliationApiEndpoint } from './inventory-reconciliation-api-endpoint';
import { InventoryDiscrepancyApiEndpoint } from './inventory-discrepancy-api-endpoint';

import { CreateProductBatchRequest } from './product-batch.request';
import { CreateWasteRecordRequest } from './waste-record.request';
import { CreateInventoryReconciliationRequest } from './inventory-reconciliation.request';
import { CreateInventoryDiscrepancyRequest } from './inventory-discrepancy.request';

/**
 * HTTP API facade for the Inventory bounded context.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over the inventory endpoint
 * clients. It exposes catalog, batch, waste and reconciliation operations to
 * the application layer while keeping HTTP details isolated in endpoints.
 */
@Injectable({ providedIn: 'root' })
export class InventoryApi extends BaseApi {
  /**
   * Endpoint client for products.
   */
  private readonly productEndpoint: ProductApiEndpoint;

  /**
   * Endpoint client for warehouse zones.
   */
  private readonly zoneEndpoint: WarehouseZoneApiEndpoint;

  /**
   * Endpoint client for product batches.
   */
  private readonly batchEndpoint: ProductBatchApiEndpoint;

  /**
   * Endpoint client for waste records.
   */
  private readonly wasteEndpoint: WasteRecordApiEndpoint;

  /**
   * Endpoint client for reconciliations.
   */
  private readonly reconciliationEndpoint: InventoryReconciliationApiEndpoint;

  /**
   * Endpoint client for discrepancies.
   */
  private readonly discrepancyEndpoint: InventoryDiscrepancyApiEndpoint;

  /**
   * Creates a new InventoryApi facade.
   *
   * @param http - Angular HttpClient used by endpoint clients
   */
  constructor(http: HttpClient) {
    super();
    this.productEndpoint = new ProductApiEndpoint(http);
    this.zoneEndpoint = new WarehouseZoneApiEndpoint(http);
    this.batchEndpoint = new ProductBatchApiEndpoint(http);
    this.wasteEndpoint = new WasteRecordApiEndpoint(http);
    this.reconciliationEndpoint = new InventoryReconciliationApiEndpoint(http);
    this.discrepancyEndpoint = new InventoryDiscrepancyApiEndpoint(http);
  }

  /**
   * Retrieves every product.
   *
   * @returns Observable stream emitting Product entities
   */
  getProducts(): Observable<Product[]> {
    return this.productEndpoint.getAll();
  }

  /**
   * Retrieves every warehouse zone.
   *
   * @returns Observable stream emitting WarehouseZone entities
   */
  getZones(): Observable<WarehouseZone[]> {
    return this.zoneEndpoint.getAll();
  }

  /**
   * Retrieves every product batch.
   *
   * @returns Observable stream emitting ProductBatch entities
   */
  getBatches(): Observable<ProductBatch[]> {
    return this.batchEndpoint.getAll();
  }

  /**
   * Retrieves the batches whose code matches the scanned value.
   *
   * @param batchNumber - Batch code read by the scanner
   * @returns Observable stream emitting the matching ProductBatch entities
   */
  findBatchesByCode(batchNumber: string): Observable<ProductBatch[]> {
    return this.batchEndpoint.getByQuery({ batchNumber });
  }

  /**
   * Creates a product batch.
   *
   * @param request - Batch creation payload
   * @returns Observable stream emitting the created ProductBatch
   */
  createBatch(request: CreateProductBatchRequest): Observable<ProductBatch> {
    return this.batchEndpoint.createFromRequest(request);
  }

  /**
   * Partially updates a product batch.
   *
   * @param id - Identifier of the batch
   * @param changes - Fields to change
   * @returns Observable stream emitting the updated ProductBatch
   */
  updateBatch(
    id: number,
    changes: Partial<Pick<ProductBatch, 'currentQty' | 'status' | 'receivedAt'>>,
  ): Observable<ProductBatch> {
    return this.batchEndpoint.patch(id, changes);
  }

  /**
   * Retrieves every waste record.
   *
   * @returns Observable stream emitting WasteRecord entities
   */
  getWasteRecords(): Observable<WasteRecord[]> {
    return this.wasteEndpoint.getAll();
  }

  /**
   * Creates a waste record.
   *
   * @param request - Waste creation payload
   * @returns Observable stream emitting the created WasteRecord
   */
  createWasteRecord(request: CreateWasteRecordRequest): Observable<WasteRecord> {
    return this.wasteEndpoint.createFromRequest(request);
  }

  /**
   * Retrieves every reconciliation.
   *
   * @returns Observable stream emitting InventoryReconciliation entities
   */
  getReconciliations(): Observable<InventoryReconciliation[]> {
    return this.reconciliationEndpoint.getAll();
  }

  /**
   * Creates a reconciliation.
   *
   * @param request - Reconciliation creation payload
   * @returns Observable stream emitting the created InventoryReconciliation
   */
  createReconciliation(
    request: CreateInventoryReconciliationRequest,
  ): Observable<InventoryReconciliation> {
    return this.reconciliationEndpoint.createFromRequest(request);
  }

  /**
   * Confirms a reconciliation.
   *
   * @param id - Identifier of the reconciliation
   * @param userId - Identifier of the confirming user
   * @returns Observable stream emitting the updated InventoryReconciliation
   */
  confirmReconciliation(id: number, userId: number): Observable<InventoryReconciliation> {
    return this.reconciliationEndpoint.patch(id, {
      status: 'RECONCILED',
      confirmedBy: userId,
      confirmedAt: new Date().toISOString(),
    });
  }

  /**
   * Retrieves every discrepancy.
   *
   * @returns Observable stream emitting InventoryDiscrepancy entities
   */
  getDiscrepancies(): Observable<InventoryDiscrepancy[]> {
    return this.discrepancyEndpoint.getAll();
  }

  /**
   * Creates a discrepancy.
   *
   * @param request - Discrepancy creation payload
   * @returns Observable stream emitting the created InventoryDiscrepancy
   */
  createDiscrepancy(
    request: CreateInventoryDiscrepancyRequest,
  ): Observable<InventoryDiscrepancy> {
    return this.discrepancyEndpoint.createFromRequest(request);
  }

  /**
   * Marks a discrepancy as resolved.
   *
   * @param id - Identifier of the discrepancy
   * @param note - Resolution note
   * @returns Observable stream emitting the updated InventoryDiscrepancy
   */
  resolveDiscrepancy(id: number, note: string): Observable<InventoryDiscrepancy> {
    return this.discrepancyEndpoint.patch(id, {
      status: 'RESOLVED',
      resolvedAt: new Date().toISOString(),
      resolutionNote: note,
    });
  }
}
