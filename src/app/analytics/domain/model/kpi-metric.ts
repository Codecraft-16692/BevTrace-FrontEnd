/**
 * Value object representing a consolidated logistics indicator.
 *
 * @remarks
 * In Domain-Driven Design, KpiMetric is a value object without identity. It is
 * embedded in a LogisticsReport and identified by its metric name.
 */
export interface KpiMetric {
  /**
   * The indicator code: OTIF, FILL_RATE, ERI, INVENTORY_ROTATION or SHRINKAGE_RATE.
   */
  metricName: string;

  /**
   * The value of the indicator for the evaluated period.
   */
  actualValue: number;
}
