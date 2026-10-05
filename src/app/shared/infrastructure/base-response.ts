/**
 * Base resource interface representing a minimal API resource with a numeric identifier.
 * @remarks All API responses from the BevTrace mock REST API (json-server) return
 * resources with numeric identifiers.
 * @author BevTrace
 */
export interface BaseResource {
  /**
   * The unique identifier of the resource.
   */
  id: number;
}

/**
 * Base response interface for paginated or wrapped API responses.
 * @remarks Extend this interface when the backend wraps results in a
 * pagination envelope (e.g. { content: [], totalPages: N }).
 * @author BevTrace
 */
export interface BaseResponse {}
