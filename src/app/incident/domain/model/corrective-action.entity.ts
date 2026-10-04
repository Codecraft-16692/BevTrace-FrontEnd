import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a corrective action within the incident domain.
 *
 * @remarks
 * In Domain-Driven Design, CorrectiveAction is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the incident bounded context.
 */
export class CorrectiveAction implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the incident.
   */
  incidentId: number;

  /**
   * The identifier of the user who applied the action.
   */
  userId: number;

  /**
   * The description of the action.
   */
  description: string;

  /**
   * The ISO 8601 timestamp of the action.
   */
  appliedAt: string;

  /**
   * The name of the user who applied the action.
   */
  appliedByName: string;

  /**
   * Creates a new CorrectiveAction entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    incidentId: number;
    userId: number;
    description: string;
    appliedAt: string;
    appliedByName: string;
  }) {
    this.id = params.id;
    this.incidentId = params.incidentId;
    this.userId = params.userId;
    this.description = params.description;
    this.appliedAt = params.appliedAt;
    this.appliedByName = params.appliedByName;
  }
}
