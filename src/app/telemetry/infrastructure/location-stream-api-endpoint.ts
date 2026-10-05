import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { LocationStream } from '../domain/model/location-stream.entity';
import { LocationStreamResource, LocationStreamsResponse } from './location-stream-response';
import { LocationStreamAssembler } from './location-stream-assembler';

const locationStreamEndpointUrl = `${environment.serverBasePath}${environment.telemetryStreamsEndpointPath}`;

/**
 * HTTP endpoint client for a telemetry reading.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class LocationStreamApiEndpoint extends BaseApiEndpoint<
  LocationStream,
  LocationStreamResource,
  LocationStreamsResponse,
  LocationStreamAssembler
> {
  /**
   * Creates a new LocationStreamApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, locationStreamEndpointUrl, new LocationStreamAssembler());
    this.expansions = ['device'];
  }
}
