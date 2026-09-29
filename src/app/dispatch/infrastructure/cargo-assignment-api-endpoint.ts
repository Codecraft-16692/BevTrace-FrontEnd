import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { CargoAssignment } from '../domain/model/cargo-assignment.entity';
import { CargoAssignmentResource, CargoAssignmentsResponse } from './cargo-assignment-response';
import { CargoAssignmentAssembler } from './cargo-assignment-assembler';

const cargoAssignmentEndpointUrl = `${environment.serverBasePath}${environment.dispatchCargoEndpointPath}`;

/**
 * HTTP endpoint client for a cargo assignment.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class CargoAssignmentApiEndpoint extends BaseApiEndpoint<
  CargoAssignment,
  CargoAssignmentResource,
  CargoAssignmentsResponse,
  CargoAssignmentAssembler
> {
  /**
   * Creates a new CargoAssignmentApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, cargoAssignmentEndpointUrl, new CargoAssignmentAssembler());
    this.expansions = ['batch'];
  }
}
