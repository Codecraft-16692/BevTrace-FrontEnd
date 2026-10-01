import { BaseEntity } from '../domain/model/base-entity';
import { BaseResource, BaseResponse } from './base-response';
import { BaseAssembler } from './base-assembler';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ErrorHandlingEnabledBaseType } from './error-handling-enabled-base-type';

/**
 * Abstract base class for BevTrace API endpoints handling CRUD operations.
 * @remarks Provides common GET/POST/PUT/PATCH/DELETE methods using the BevTrace
 * REST API conventions. All IDs are numeric. Each bounded context endpoint
 * extends this class and passes the correct assembler for entity mapping.
 * Related resources can be embedded through the `expansions` list. The embedding
 * is resolved by the frontend (one extra request per related collection), so it
 * does not depend on the `_expand` feature of the mock server and works the same
 * way against any REST backend that exposes plain collections.
 * @template TEntity    - The domain entity type extending BaseEntity.
 * @template TResource  - The API resource type extending BaseResource.
 * @template TResponse  - The API response envelope type extending BaseResponse.
 * @template TAssembler - The assembler type extending BaseAssembler.
 * @author BevTrace
 */
export abstract class BaseApiEndpoint<
  TEntity extends BaseEntity,
  TResource extends BaseResource,
  TResponse extends BaseResponse,
  TAssembler extends BaseAssembler<TEntity, TResource, TResponse>,
> extends ErrorHandlingEnabledBaseType {
  /**
   * Names of related resources embedded in every read operation.
   */
  protected expansions: string[] = [];

  /**
   * Creates a new BaseApiEndpoint instance.
   * @param http        - The Angular HTTP client for making requests.
   * @param endpointUrl - The fully qualified URL for the API endpoint.
   * @param assembler   - The assembler for converting between entities and resources.
   */
  protected constructor(
    protected http: HttpClient,
    protected endpointUrl: string,
    protected assembler: TAssembler,
  ) {
    super();
  }

  /**
   * Builds the query parameters for read operations.
   * @param query - Optional filter, sorting or pagination parameters.
   * @returns The HTTP parameters.
   */
  protected buildParams(query: Record<string, string | number | boolean> = {}): HttpParams {
    let params = new HttpParams();
    Object.entries(query).forEach(([key, value]) => {
      params = params.set(key, String(value));
    });
    return params;
  }

  /**
   * Resolves the collection name of a related resource.
   * @param name - Singular name of the related resource, for example `batch`.
   * @returns The plural collection name, for example `batches`.
   */
  private collectionOf(name: string): string {
    return /(ch|s|x)$/.test(name) ? `${name}es` : `${name}s`;
  }

  /**
   * Embeds the related resources listed in `expansions` into each resource.
   * @param resources - Resources received from the API.
   * @returns An observable of the resources with their related resources embedded.
   */
  private expand(resources: TResource[]): Observable<TResource[]> {
    if (this.expansions.length === 0 || resources.length === 0) {
      return of(resources);
    }

    const lookups = this.expansions.map((name) =>
      this.http
        .get<{ id: number }[]>(`${environment.serverBasePath}/${this.collectionOf(name)}`)
        .pipe(map((items) => ({ name, items }))),
    );

    return forkJoin(lookups).pipe(
      map((tables) =>
        resources.map((resource) => {
          const expanded = { ...resource } as unknown as Record<string, unknown>;
          tables.forEach(({ name, items }) => {
            const foreignKey = (resource as unknown as Record<string, number | null>)[`${name}Id`];
            expanded[name] = items.find((item) => item.id === foreignKey);
          });
          return expanded as unknown as TResource;
        }),
      ),
    );
  }

  /**
   * Retrieves all entities from the API endpoint.
   * @returns An observable of an array of domain entities.
   */
  getAll(): Observable<TEntity[]> {
    return this.http
      .get<TResponse | TResource[]>(this.endpointUrl)
      .pipe(
        switchMap((response) => {
          if (Array.isArray(response)) {
            return this.expand(response).pipe(
              map((resources) => resources.map((resource) => this.assembler.toEntityFromResource(resource))),
            );
          }
          return of(this.assembler.toEntitiesFromResponse(response as TResponse));
        }),
        catchError(this.handleError('Failed to fetch entities')),
      );
  }

  /**
   * Retrieves the entities matching the given query parameters.
   * @param query - Filter, sorting or pagination parameters (json-server syntax).
   * @returns An observable of an array of domain entities.
   */
  getByQuery(query: Record<string, string | number | boolean>): Observable<TEntity[]> {
    return this.http
      .get<TResource[]>(this.endpointUrl, { params: this.buildParams(query) })
      .pipe(
        switchMap((resources) => this.expand(resources)),
        map((resources) => resources.map((resource) => this.assembler.toEntityFromResource(resource))),
        catchError(this.handleError('Failed to query entities')),
      );
  }

  /**
   * Retrieves a single entity by its numeric identifier.
   * @param id - The numeric ID of the entity to retrieve.
   * @returns An observable of the domain entity.
   */
  getById(id: number): Observable<TEntity> {
    return this.http
      .get<TResource>(`${this.endpointUrl}/${id}`)
      .pipe(
        switchMap((resource) => this.expand([resource])),
        map((resources) => this.assembler.toEntityFromResource(resources[0])),
        catchError(this.handleError(`Failed to fetch entity with id ${id}`)),
      );
  }

  /**
   * Creates a new entity via POST request.
   * @param entity - The domain entity to create.
   * @returns An observable of the created domain entity.
   */
  create(entity: TEntity): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.post<TResource>(this.endpointUrl, resource).pipe(
      map((createdResource) => this.assembler.toEntityFromResource(createdResource)),
      catchError(this.handleError('Failed to create entity')),
    );
  }

  /**
   * Creates a new entity from a request payload via POST request.
   * @param request - The request payload built from a command.
   * @returns An observable of the created domain entity.
   */
  createFromRequest<TRequest extends object>(request: TRequest): Observable<TEntity> {
    return this.http.post<TResource>(this.endpointUrl, request).pipe(
      map((createdResource) => this.assembler.toEntityFromResource(createdResource)),
      catchError(this.handleError('Failed to create entity')),
    );
  }

  /**
   * Updates an existing entity via PUT request.
   * @param entity - The domain entity with updated values.
   * @param id     - The numeric ID of the entity to update.
   * @returns An observable of the updated domain entity.
   */
  update(entity: TEntity, id: number): Observable<TEntity> {
    const resource = this.assembler.toResourceFromEntity(entity);
    return this.http.put<TResource>(`${this.endpointUrl}/${id}`, resource).pipe(
      map((updatedResource) => this.assembler.toEntityFromResource(updatedResource)),
      catchError(this.handleError(`Failed to update entity with id ${id}`)),
    );
  }

  /**
   * Partially updates an existing entity via PATCH request.
   * @param id      - The numeric ID of the entity to update.
   * @param changes - The subset of resource fields to change.
   * @returns An observable of the updated domain entity.
   */
  patch(id: number, changes: Partial<TResource>): Observable<TEntity> {
    return this.http.patch<TResource>(`${this.endpointUrl}/${id}`, changes).pipe(
      map((updatedResource) => this.assembler.toEntityFromResource(updatedResource)),
      catchError(this.handleError(`Failed to patch entity with id ${id}`)),
    );
  }

  /**
   * Deletes an entity by its numeric identifier via DELETE request.
   * @param id - The numeric ID of the entity to delete.
   * @returns An observable that completes when deletion is done.
   */
  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.endpointUrl}/${id}`)
      .pipe(catchError(this.handleError(`Failed to delete entity with id ${id}`)));
  }
}
