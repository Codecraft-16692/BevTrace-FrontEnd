import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a platform user within the iam domain.
 *
 * @remarks
 * In Domain-Driven Design, User is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the iam bounded context.
 */
export class User implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The identifier of the role assigned to the user.
   */
  roleId: number;

  /**
   * The full name of the user.
   */
  name: string;

  /**
   * The e-mail address used to sign in.
   */
  email: string;

  /**
   * The contact phone number.
   */
  phone: string;

  /**
   * Indicates whether the account is enabled.
   */
  active: boolean;

  /**
   * The ISO 8601 timestamp of account creation.
   */
  createdAt: string;

  /**
   * The name of the assigned role.
   */
  roleName: string;

  /**
   * Creates a new User entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    roleId: number;
    name: string;
    email: string;
    phone: string;
    active: boolean;
    createdAt: string;
    roleName: string;
  }) {
    this.id = params.id;
    this.roleId = params.roleId;
    this.name = params.name;
    this.email = params.email;
    this.phone = params.phone;
    this.active = params.active;
    this.createdAt = params.createdAt;
    this.roleName = params.roleName;
  }
}
