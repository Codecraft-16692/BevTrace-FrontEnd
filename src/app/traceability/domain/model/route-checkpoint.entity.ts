import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a route checkpoint within the traceability domain.
 *
 * @remarks
 * In Domain-Driven Design, RouteCheckpoint is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the traceability bounded context.
 */
export class RouteCheckpoint implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the traceability log.
   */
  logId: number;

  /**
   * The position of the checkpoint in the route.
   */
  sequence: number;

  /**
   * The checkpoint location name.
   */
  locationName: string;

  /**
   * The checkpoint latitude.
   */
  latitude: number;

  /**
   * The checkpoint longitude.
   */
  longitude: number;

  /**
   * The checkpoint status.
   */
  status: 'PENDING' | 'REACHED' | 'OMITTED';

  /**
   * The ISO 8601 timestamp when the checkpoint was reached.
   */
  reachedAt: string | null;

  /**
   * The observation registered for omitted checkpoints.
   */
  observation: string | null;

  /**
   * Creates a new RouteCheckpoint entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    logId: number;
    sequence: number;
    locationName: string;
    latitude: number;
    longitude: number;
    status: 'PENDING' | 'REACHED' | 'OMITTED';
    reachedAt: string | null;
    observation: string | null;
  }) {
    this.id = params.id;
    this.logId = params.logId;
    this.sequence = params.sequence;
    this.locationName = params.locationName;
    this.latitude = params.latitude;
    this.longitude = params.longitude;
    this.status = params.status;
    this.reachedAt = params.reachedAt;
    this.observation = params.observation;
  }
}
