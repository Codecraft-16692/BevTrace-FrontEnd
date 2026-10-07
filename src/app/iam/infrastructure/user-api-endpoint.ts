import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { environment } from '../../../environments/environment';
import { User } from '../domain/model/user.entity';
import { UserResource, UsersResponse } from './user-response';
import { UserAssembler } from './user-assembler';

const userEndpointUrl = `${environment.serverBasePath}${environment.usersEndpointPath}`;

/**
 * HTTP endpoint client for a platform user.
 *
 * @remarks
 * This endpoint belongs to the infrastructure layer and extends the shared
 * BaseApiEndpoint to provide CRUD operations against the mock REST API.
 */
export class UserApiEndpoint extends BaseApiEndpoint<
  User,
  UserResource,
  UsersResponse,
  UserAssembler
> {
  /**
   * Creates a new UserApiEndpoint instance.
   *
   * @param http - Angular HttpClient used to perform HTTP requests
   */
  constructor(http: HttpClient) {
    super(http, userEndpointUrl, new UserAssembler());
    this.expansions = ['role'];
  }
}
