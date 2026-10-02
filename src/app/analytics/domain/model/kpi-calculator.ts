import { DispatchOrder } from '../../../dispatch/domain/model/dispatch-order.entity';
import { ProductBatch } from '../../../inventory/domain/model/product-batch.entity';
import { WasteRecord } from '../../../inventory/domain/model/waste-record.entity';
import { InventoryReconciliation } from '../../../inventory/domain/model/inventory-reconciliation.entity';
import { KpiMetric } from './kpi-metric';

/**
 * Operational data required to calculate the indicators.
 */
export interface OperationalData {
  /**
   * Dispatch orders of the platform.
   */
  orders: DispatchOrder[];

  /**
   * Product batches of the warehouse.
   */
  batches: ProductBatch[];

  /**
   * Waste records of the warehouse.
   */
  waste: WasteRecord[];

  /**
   * Inventory reconciliations of the warehouse.
   */
  reconciliations: InventoryReconciliation[];
}

/**
 * Indicators calculated for a period.
 */
export interface Indicators {
  /**
   * On Time In Full percentage of the delivered orders.
   */
  otif: number;

  /**
   * Percentage of requested units that were delivered.
   */
  fillRate: number;

  /**
   * Inventory Record Accuracy percentage of the confirmed reconciliations.
   */
  eri: number;

  /**
   * Units shipped divided by the units currently stored.
   */
  inventoryRotation: number;

  /**
   * Units lost divided by the units received, as a percentage.
   */
  shrinkageRate: number;

  /**
   * Indicates whether the period contains operational data.
   */
  hasData: boolean;
}

/**
 * Domain service that calculates the logistics indicators of a period.
 *
 * @remarks
 * The calculations are pure functions over the operational data so they can be
 * tested without the API. Dates are compared as ISO date strings (YYYY-MM-DD).
 */
export class KpiCalculator {
  /**
   * Determines whether an ISO date belongs to a period.
   *
   * @param value - ISO date or date time
   * @param start - First day of the period
   * @param end - Last day of the period
   * @returns True when the date is inside the period
   */
  static inPeriod(value: string | null, start: string, end: string): boolean {
    if (!value) return false;
    const day = value.slice(0, 10);
    return day >= start && day <= end;
  }

  /**
   * Determines whether a delivered order arrived on or before its scheduled day.
   *
   * @param order - Delivered order
   * @returns True when the delivery was on time
   */
  static isOnTime(order: DispatchOrder): boolean {
    return !!order.deliveredAt && order.deliveredAt.slice(0, 10) <= order.scheduledDate;
  }

  /**
   * Returns the orders delivered inside a period.
   *
   * @param data - Operational data
   * @param start - First day of the period
   * @param end - Last day of the period
   * @returns Delivered orders of the period
   */
  static deliveredIn(data: OperationalData, start: string, end: string): DispatchOrder[] {
    return data.orders.filter(
      (order) => order.status === 'DELIVERED' && KpiCalculator.inPeriod(order.deliveredAt, start, end),
    );
  }

  /**
   * Calculates the indicators of a period.
   *
   * @param data - Operational data
   * @param start - First day of the period
   * @param end - Last day of the period
   * @returns Indicators of the period
   */
  static calculate(data: OperationalData, start: string, end: string): Indicators {
    const delivered = KpiCalculator.deliveredIn(data, start, end);
    const wasteInPeriod = data.waste.filter((record) => KpiCalculator.inPeriod(record.reportedDate, start, end));
    const reconciled = data.reconciliations.filter(
      (item) => item.status === 'RECONCILED' && KpiCalculator.inPeriod(item.date, start, end),
    );

    const round = (value: number) => Math.round(value * 100) / 100;

    const inFull = delivered.filter((order) => (order.deliveredQuantity ?? 0) >= order.requestedQuantity);
    const onTimeInFull = inFull.filter((order) => KpiCalculator.isOnTime(order));
    const requested = delivered.reduce((sum, order) => sum + order.requestedQuantity, 0);
    const shipped = delivered.reduce((sum, order) => sum + (order.deliveredQuantity ?? 0), 0);
    const stock = data.batches
      .filter((batch) => batch.status === 'AVAILABLE')
      .reduce((sum, batch) => sum + batch.currentQty, 0);
    const received = data.batches
      .filter((batch) => batch.receivedAt !== null && batch.receivedAt.slice(0, 10) <= end)
      .reduce((sum, batch) => sum + batch.initialQty, 0);
    const lost = wasteInPeriod.reduce((sum, record) => sum + record.quantity, 0);

    return {
      otif: delivered.length === 0 ? 0 : round((onTimeInFull.length / delivered.length) * 100),
      fillRate: requested === 0 ? 0 : round((shipped / requested) * 100),
      eri: reconciled.length === 0 ? 0 : round(reconciled.reduce((sum, item) => sum + item.eriPercentage, 0) / reconciled.length),
      inventoryRotation: stock === 0 ? 0 : round(shipped / stock),
      shrinkageRate: received === 0 ? 0 : round((lost / received) * 100),
      hasData: delivered.length > 0 || wasteInPeriod.length > 0 || reconciled.length > 0,
    };
  }

  /**
   * Converts the indicators into the metrics stored in a report.
   *
   * @param indicators - Indicators of the period
   * @returns Metrics ready to be persisted
   */
  static toMetrics(indicators: Indicators): KpiMetric[] {
    return [
      { metricName: 'OTIF', actualValue: indicators.otif },
      { metricName: 'FILL_RATE', actualValue: indicators.fillRate },
      { metricName: 'ERI', actualValue: indicators.eri },
      { metricName: 'INVENTORY_ROTATION', actualValue: indicators.inventoryRotation },
      { metricName: 'SHRINKAGE_RATE', actualValue: indicators.shrinkageRate },
    ];
  }
}
