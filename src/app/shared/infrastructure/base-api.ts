/**
 * Abstract base class for all BevTrace API gateway services.
 * @remarks Acts as the root class for bounded context API classes
 * (e.g. InventoryApi, DispatchApi). Child classes aggregate
 * multiple endpoint classes and expose them to the application store.
 * @author BevTrace
 */
export abstract class BaseApi {
  // No methods defined; children classes aggregate specific API endpoints.
}
