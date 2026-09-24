import { Component, computed, input, output } from '@angular/core';

import { MapRoute } from '../../../domain/model/map-route';

/**
 * Width of the SVG view box.
 */
const WIDTH = 640;

/**
 * Height of the SVG view box.
 */
const HEIGHT = 380;

/**
 * Padding kept around the drawn routes.
 */
const PADDING = 40;

/**
 * @summary Schematic route map rendered with SVG.
 * @remarks Draws the routes, their checkpoints and the vehicles in transit by
 * projecting latitude and longitude to the SVG plane. It replaces the external
 * Maps API and emits the identifier of the route selected by the user.
 * @author BevTrace
 */
@Component({
  selector: 'app-route-canvas',
  standalone: true,
  templateUrl: './route-canvas.html',
  styleUrl: './route-canvas.css',
})
export class RouteCanvas {
  /**
   * Routes to draw.
   */
  readonly routes = input<MapRoute[]>([]);

  /**
   * Identifier of the highlighted route.
   */
  readonly selectedId = input<number | null>(null);

  /**
   * Emits the identifier of the route clicked by the user.
   */
  readonly routeSelected = output<number>();

  /**
   * View box width exposed to the template.
   */
  protected readonly width = WIDTH;

  /**
   * View box height exposed to the template.
   */
  protected readonly height = HEIGHT;

  /**
   * Projected routes ready to be rendered.
   */
  protected readonly layout = computed(() => {
    const routes = this.routes();
    const coordinates = routes.flatMap((route) => [
      ...route.points.map((point) => ({ lat: point.latitude, lng: point.longitude })),
      ...(route.vehicle ? [{ lat: route.vehicle.latitude, lng: route.vehicle.longitude }] : []),
    ]);

    if (coordinates.length === 0) return [];

    const minLat = Math.min(...coordinates.map((c) => c.lat));
    const maxLat = Math.max(...coordinates.map((c) => c.lat));
    const minLng = Math.min(...coordinates.map((c) => c.lng));
    const maxLng = Math.max(...coordinates.map((c) => c.lng));
    const latSpan = Math.max(maxLat - minLat, 0.05);
    const lngSpan = Math.max(maxLng - minLng, 0.05);

    const project = (lat: number, lng: number) => ({
      x: PADDING + ((lng - minLng) / lngSpan) * (WIDTH - PADDING * 2),
      y: HEIGHT - PADDING - ((lat - minLat) / latSpan) * (HEIGHT - PADDING * 2),
    });

    return routes.map((route) => {
      const dots = route.points.map((point) => ({
        ...project(point.latitude, point.longitude),
        label: point.label,
        status: point.status,
      }));
      return {
        id: route.id,
        label: route.label,
        color: route.color,
        polyline: dots.map((dot) => `${dot.x},${dot.y}`).join(' '),
        dots,
        vehicle: route.vehicle ? project(route.vehicle.latitude, route.vehicle.longitude) : null,
      };
    });
  });

  /**
   * Emits the selected route.
   *
   * @param id - Identifier of the clicked route
   */
  protected select(id: number): void {
    this.routeSelected.emit(id);
  }
}
