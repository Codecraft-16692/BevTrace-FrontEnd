import { BaseEntity } from '../../../shared/domain/model/base-entity';

/**
 * Represents a physical warehouse zone within the inventory domain.
 *
 * @remarks
 * In Domain-Driven Design, WarehouseZone is an entity with a stable identity represented by
 * its numeric identifier. It belongs to the inventory bounded context.
 */
export class WarehouseZone implements BaseEntity {
  /**
   * The unique numeric identifier.
   */
  id: number;

  /**
   * The zone name.
   */
  name: string;

  /**
   * The aisle code.
   */
  aisle: string;

  /**
   * The rack code.
   */
  rack: string;

  /**
   * Creates a new WarehouseZone entity.
   *
   * @param params - Initialization properties
   */
  constructor(params: {
    id: number;
    name: string;
    aisle: string;
    rack: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.aisle = params.aisle;
    this.rack = params.rack;
  }
}
