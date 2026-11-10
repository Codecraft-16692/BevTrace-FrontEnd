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

import { RegisterBatchRequest } from './product-batch.request';
import { RegisterWasteRequest } from './waste-record.request';

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
   * Registers an expected batch (POST /batches).
   *
   * @param request - Batch data
   * @returns Observable completing when the batch was registered
   */
  registerBatch(request: RegisterBatchRequest): Observable<ProductBatch> {
    return this.batchEndpoint.createFromRequest(request);
  }

  /**
   * Receives an expected batch by its scanned code (POST /batches/receptions).
   *
   * @param scanCode - Scanned batch code
   * @returns Observable completing when the batch was received
   */
  receiveBatch(scanCode: string): Observable<void> {
    return this.batchEndpoint.command('POST', 'receptions', { scanCode });
  }

  /**
   * Registers a waste record (POST /waste-records). The backend deducts the stock.
   *
   * @param request - Waste data
   * @returns Observable completing when the waste was registered
   */
  registerWaste(request: RegisterWasteRequest): Observable<WasteRecord> {
    return this.wasteEndpoint.createFromRequest(request);
  }

  /**
   * Runs a reconciliation (POST /reconciliations).
   *
   * @param counts - Counted quantity per batch
   * @returns Observable completing when the reconciliation was created
   */
  runReconciliation(counts: { batchId: number; countedQty: number }[]): Observable<InventoryReconciliation> {
    return this.reconciliationEndpoint.createFromRequest({ counts });
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
   * Retrieves every reconciliation.
   *
   * @returns Observable stream emitting InventoryReconciliation entities
   */
  getReconciliations(): Observable<InventoryReconciliation[]> {
    return this.reconciliationEndpoint.getAll();
  }


  /**
   * Confirms a reconciliation (POST /reconciliations/{id}/confirmation).
   *
   * @param id - Reconciliation identifier
   * @returns Observable completing when it was confirmed
   */
  confirmReconciliation(id: number): Observable<void> {
    return this.reconciliationEndpoint.command('POST', `${id}/confirmation`);
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
   * Resolves a discrepancy (POST /discrepancies/{id}/resolution).
   *
   * @param id   - Discrepancy identifier
   * @param note - Explanatory note
   * @returns Observable completing when it was resolved
   */
  resolveDiscrepancy(id: number, note: string): Observable<void> {
    return this.discrepancyEndpoint.command('POST', `${id}/resolution`, { note });
  }}
