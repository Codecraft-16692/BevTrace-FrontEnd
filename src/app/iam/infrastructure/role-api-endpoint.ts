import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { Role } from '../domain/model/role.entity';
import { RoleResource, RolesResponse } from './role-response';
import { RoleAssembler } from './role-assembler';

const roleEndpointUrl = `${environment.serverBasePath}${environment.rolesEndpointPath}`;

/**
 * HTTP endpoint client for an authorization role.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class RoleApiEndpoint extends BaseApiEndpoint<
  Role,
  RoleResource,
  RolesResponse,
  RoleAssembler
> {
  /**
   * Creates a new RoleApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, roleEndpointUrl, new RoleAssembler());
  }
}
