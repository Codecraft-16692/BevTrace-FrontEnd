import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents an authorization role within the iam domain.
 *
 * @remarks
 * In Domain-Driven Design, Role is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the iam bounded context.
 */
export class Role implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The role name, prefixed with ROLE_.
   */
  name: string;

  /**
   * Indicates whether the role grants administrator privileges.
   */
  isAdmin: boolean;

  /**
   * Creates a new Role entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    name: string;
    isAdmin: boolean;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.isAdmin = params.isAdmin;
  }
}
