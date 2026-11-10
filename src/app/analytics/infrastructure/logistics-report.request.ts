/**
 * Request payload to generate a logistics report (POST /logistics-reports).
 *
 * @remarks
 * The user comes from the token and the KPIs are computed by the backend.
 */
export interface GenerateLogisticsReportRequest {
  periodStart: string;

  periodEnd: string;
}
