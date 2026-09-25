import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { WasteRecord } from '../domain/model/waste-record.entity';
import { WasteRecordResource, WasteRecordsResponse } from './waste-record-response';
import { WasteRecordAssembler } from './waste-record-assembler';

const wasteRecordEndpointUrl = `${environment.serverBasePath}${environment.inventoryWasteRecordsEndpointPath}`;

/**
 * HTTP endpoint client for a product waste (shrinkage) record.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class WasteRecordApiEndpoint extends BaseApiEndpoint<
  WasteRecord,
  WasteRecordResource,
  WasteRecordsResponse,
  WasteRecordAssembler
> {
  /**
   * Creates a new WasteRecordApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, wasteRecordEndpointUrl, new WasteRecordAssembler());
    this.expansions = ['batch', 'user'];
  }
}
