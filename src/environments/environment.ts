export const environment = {
  production: true,

  // Base API URL
  serverBasePath: 'https://bevtrace-backend-production.up.railway.app/api/v1',

  // IAM
  usersEndpointPath: '/users',
  rolesEndpointPath: '/roles',

  // Inventory
  inventoryProductsEndpointPath: '/products',
  inventoryZonesEndpointPath: '/zones',
  inventoryBatchesEndpointPath: '/batches',
  inventoryWasteRecordsEndpointPath: '/waste-records',
  inventoryReconciliationsEndpointPath: '/reconciliations',
  inventoryDiscrepanciesEndpointPath: '/discrepancies',

  // Dispatch
  dispatchOrdersEndpointPath: '/dispatch-orders',
  dispatchCargoEndpointPath: '/cargo-assignments',
  dispatchDestinationsEndpointPath: '/destinations',
  dispatchVehiclesEndpointPath: '/vehicles',
  dispatchDriversEndpointPath: '/drivers',

  // Traceability
  traceabilityLogsEndpointPath: '/logs',
  traceabilityCheckpointsEndpointPath: '/route-checkpoints',
  traceabilityDeliveryRecordsEndpointPath: '/delivery-records',

  // Telemetry
  telemetryDevicesEndpointPath: '/devices',
  telemetryModelsEndpointPath: '/models',
  telemetryStreamsEndpointPath: '/location-streams',
  telemetryDisconnectionsEndpointPath: '/disconnection-periods',

  // Incident
  incidentRecordsEndpointPath: '/incidents',
  incidentRulesEndpointPath: '/rules',
  incidentActionsEndpointPath: '/corrective-actions',
  incidentNotificationsEndpointPath: '/notifications',

  // Analytics
  analyticsReportsEndpointPath: '/logistics-reports',

  // Subscriptions
  subscriptionPlansEndpointPath: '/subscription-plans',
  subscriptionsEndpointPath: '/subscriptions',
  subscriptionPaymentsEndpointPath: '/payments',
  subscriptionNewsletterEndpointPath: '/newsletter-subscribers',
  subscriptionContactsEndpointPath: '/contact-requests',
};
