/**
 * Point drawn on the route canvas.
 */
export interface MapPoint {
  /**
   * Latitude of the point.
   */
  latitude: number;

  /**
   * Longitude of the point.
   */
  longitude: number;

  /**
   * Label shown when the point is hovered.
   */
  label: string;

  /**
   * Checkpoint status used to color the point.
   */
  status: 'PENDING' | 'REACHED' | 'OMITTED';
}

/**
 * Route drawn on the route canvas.
 *
 * @remarks
 * The route canvas is a lightweight schematic map that replaces the external
 * Maps API while the backend is not available. It only needs coordinates, so
 * it can be replaced by a real map provider later.
 */
export interface MapRoute {
  /**
   * Identifier of the route, usually the traceability log identifier.
   */
  id: number;

  /**
   * Label of the route shown in the tooltip of the vehicle.
   */
  label: string;

  /**
   * CSS color used to draw the route.
   */
  color: string;

  /**
   * Ordered points of the route, from the warehouse to the destination.
   */
  points: MapPoint[];

  /**
   * Current position of the vehicle, null when there is no vehicle on the route.
   */
  vehicle: { latitude: number; longitude: number } | null;
}
