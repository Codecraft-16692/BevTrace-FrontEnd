/**
 * Geographic point of a planned route.
 */
export interface PlannedPoint {
  /**
   * Position of the point in the route, starting at 1.
   */
  sequence: number;

  /**
   * Human readable name of the location.
   */
  locationName: string;

  /**
   * Latitude of the point.
   */
  latitude: number;

  /**
   * Longitude of the point.
   */
  longitude: number;
}

/**
 * Origin of every route: the central warehouse of the distributor.
 */
export const ORIGIN = {
  name: 'BevTrace Central Warehouse - Ate',
  latitude: -12.0433,
  longitude: -76.942,
};

/**
 * Average urban speed in kilometers per hour used to estimate the arrival.
 */
const AVERAGE_SPEED_KMH = 28;

/**
 * Domain service that plans the checkpoints and the estimated time of a route.
 *
 * @remarks
 * The external Maps API is simulated: the planner interpolates two
 * intermediate checkpoints between the warehouse and the destination and
 * estimates the travel time with the haversine distance. It can be replaced by
 * a real routing provider without changing the callers.
 */
export class RoutePlanner {
  /**
   * Plans the checkpoints of a route from the warehouse to a destination.
   *
   * @param destinationName - Name of the destination client
   * @param latitude - Latitude of the destination
   * @param longitude - Longitude of the destination
   * @returns Ordered checkpoints, first the departure and last the destination
   */
  static plan(destinationName: string, latitude: number, longitude: number): PlannedPoint[] {
    const at = (ratio: number) => ({
      latitude: ORIGIN.latitude + (latitude - ORIGIN.latitude) * ratio,
      longitude: ORIGIN.longitude + (longitude - ORIGIN.longitude) * ratio,
    });

    return [
      { sequence: 1, locationName: `${ORIGIN.name} - Departure`, latitude: ORIGIN.latitude, longitude: ORIGIN.longitude },
      { sequence: 2, locationName: 'Main Avenue Checkpoint', ...at(0.33) },
      { sequence: 3, locationName: 'Expressway Checkpoint', ...at(0.66) },
      { sequence: 4, locationName: destinationName, latitude, longitude },
    ];
  }

  /**
   * Estimates the travel minutes between the warehouse and a destination.
   *
   * @param latitude - Latitude of the destination
   * @param longitude - Longitude of the destination
   * @returns Estimated minutes, never less than 60
   */
  static estimateMinutes(latitude: number, longitude: number): number {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const dLat = toRad(latitude - ORIGIN.latitude);
    const dLng = toRad(longitude - ORIGIN.longitude);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(ORIGIN.latitude)) * Math.cos(toRad(latitude)) * Math.sin(dLng / 2) ** 2;
    const km = 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.max(60, Math.round((km / AVERAGE_SPEED_KMH) * 60) + 30);
  }
}
