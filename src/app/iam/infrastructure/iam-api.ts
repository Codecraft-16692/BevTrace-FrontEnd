import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { BaseApi } from '../../shared/infrastructure/base-api';

import { User } from '../domain/model/user.entity';
import { Role } from '../domain/model/role.entity';

import { SignInApiEndpoint } from './sign-in-api-endpoint';
import { SignInAssembler } from './sign-in-assembler';
import { SignInRequest } from './sign-in.request';
import { SignInResource } from './sign-in-response';

import { SignUpApiEndpoint } from './sign-up-api-endpoint';
import { SignUpRequest } from './sign-up.request';

import { UserApiEndpoint } from './user-api-endpoint';
import { UserAssembler } from './user-assembler';
import { RoleApiEndpoint } from './role-api-endpoint';

/**
 * HTTP API facade for Identity and Access Management operations.
 *
 * @remarks
 * In a Domain-Driven Design (DDD) architecture, this service belongs to the
 * infrastructure layer and acts as a facade over IAM endpoint clients. It
 * exposes authentication and user administration operations to the application
 * layer while keeping HTTP details isolated inside endpoint classes.
 */
@Injectable({ providedIn: 'root' })
export class IamApi extends BaseApi {
  /**
   * Endpoint client responsible for sign-in operations.
   */
  private readonly signInEndpoint: SignInApiEndpoint;

  /**
   * Endpoint client responsible for sign-up operations.
   */
  private readonly signUpEndpoint: SignUpApiEndpoint;

  /**
   * Endpoint client responsible for user administration.
   */
  private readonly userEndpoint: UserApiEndpoint;

  /**
   * Endpoint client responsible for role queries.
   */
  private readonly roleEndpoint: RoleApiEndpoint;

  /**
   * Creates a new IamApi facade.
   *
   * @param http - Angular HttpClient used by endpoint clients
   */
  constructor(http: HttpClient) {
    super();
    this.signInEndpoint = new SignInApiEndpoint(http, new SignInAssembler());
    this.signUpEndpoint = new SignUpApiEndpoint(http, new UserAssembler());
    this.userEndpoint = new UserApiEndpoint(http);
    this.roleEndpoint = new RoleApiEndpoint(http);
  }

  /**
   * Authenticates an existing user.
   *
   * @param request - Sign-in request payload
   * @returns Observable stream emitting the authenticated session resource
   */
  signIn(request: SignInRequest): Observable<SignInResource> {
    return this.signInEndpoint.signIn(request);
  }

  /**
   * Registers a new user account.
   *
   * @param request - Sign-up request payload
   * @returns Observable stream emitting the registered User entity
   */
  signUp(request: SignUpRequest): Observable<User> {
    return this.signUpEndpoint.signUp(request);
  }

  /**
   * Retrieves every registered user.
   *
   * @returns Observable stream emitting User entities
   */
  getUsers(): Observable<User[]> {
    return this.userEndpoint.getAll();
  }

  /**
   * Retrieves the available authorization roles.
   *
   * @returns Observable stream emitting Role entities
   */
  getRoles(): Observable<Role[]> {
    return this.roleEndpoint.getAll();
  }

  /**
   * Changes the role of a user.
   *
   * @param userId - Numeric identifier of the user
   * @param roleId - Numeric identifier of the new role
   * @returns Observable stream emitting the updated User entity
   */
  assignRole(userId: number, roleId: number): Observable<User> {
    return this.userEndpoint.patch(userId, { roleId });
  }

  /**
   * Enables or disables a user account.
   *
   * @param userId - Numeric identifier of the user
   * @param active - New activation state
   * @returns Observable stream emitting the updated User entity
   */
  setUserActive(userId: number, active: boolean): Observable<User> {
    return this.userEndpoint.patch(userId, { active });
  }
}
