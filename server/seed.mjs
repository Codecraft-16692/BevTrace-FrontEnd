import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const now = Date.now();
const iso = (ms) => new Date(ms).toISOString();
const minAgo = (m) => iso(now - m * 60000);
const dayAgo = (d, hour = 10) => {
  const date = new Date(now - d * 86400000);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
};
const dateOnly = (ms) => new Date(ms).toISOString().split('T')[0];
const dayOnly = (d) => dateOnly(now - d * 86400000);
const inDays = (d) => dateOnly(now + d * 86400000);


const users = [
  { id: 1, roleId: 1, name: 'BevTrace Admin', email: 'bevtrace@admin.com', password: 'Admin1234', phone: '+51 1 555-0100', active: true, createdAt: dayAgo(120) },
  { id: 2, roleId: 2, name: 'Alex Rivera', email: 'alex.rivera@bevtrace.com', password: 'Logistics1', phone: '+51 987 654 321', active: true, createdAt: dayAgo(90) },
  { id: 3, roleId: 3, name: 'María Paz', email: 'maria.paz@bevtrace.com', password: 'Warehouse1', phone: '+51 987 111 222', active: true, createdAt: dayAgo(80) },
  { id: 4, roleId: 2, name: 'Carolina Vega', email: 'carolina.vega@andinabev.pe', password: 'Andina2026', phone: '+51 955 222 333', active: true, createdAt: dayAgo(45) },
  { id: 5, roleId: 3, name: 'Jorge Salas', email: 'jorge.salas@andinabev.pe', password: 'Andina2027', phone: '+51 955 444 555', active: false, createdAt: dayAgo(30) },
];

const products = [
  { id: 1, skuCode: 'BT-AGU-500', name: 'Agua Mineral 500 ml', category: 'Water', volumeMl: 500, packagingType: 'PET' },
  { id: 2, skuCode: 'BT-GAS-500', name: 'Agua con Gas 500 ml', category: 'Water', volumeMl: 500, packagingType: 'PET' },
  { id: 3, skuCode: 'BT-COL-1500', name: 'Gaseosa Cola 1.5 L', category: 'Soda', volumeMl: 1500, packagingType: 'PET' },
  { id: 4, skuCode: 'BT-LIM-2000', name: 'Gaseosa Limón 2 L', category: 'Soda', volumeMl: 2000, packagingType: 'PET' },
  { id: 5, skuCode: 'BT-NAR-1000', name: 'Jugo de Naranja 1 L', category: 'Juice', volumeMl: 1000, packagingType: 'PET' },
  { id: 6, skuCode: 'BT-ISO-750', name: 'Bebida Isotónica 750 ml', category: 'Sports', volumeMl: 750, packagingType: 'PET' },
  { id: 7, skuCode: 'BT-TEH-500', name: 'Té Helado 500 ml', category: 'Tea', volumeMl: 500, packagingType: 'PET' },
  { id: 8, skuCode: 'BT-BID-20000', name: 'Agua Bidón 20 L', category: 'Water', volumeMl: 20000, packagingType: 'Returnable' },
];

const warehouseZones = [
  { id: 1, name: 'Zone A - Cold Dock', aisle: 'A1', rack: 'R01' },
  { id: 2, name: 'Zone B - Bulk Storage', aisle: 'B2', rack: 'R05' },
  { id: 3, name: 'Zone C - Fast Picking', aisle: 'C1', rack: 'R02' },
  { id: 4, name: 'Zone D - Returnables', aisle: 'D3', rack: 'R09' },
  { id: 5, name: 'Zone E - Overflow', aisle: 'E1', rack: 'R11' },
];

const batchSpecs = [
  [1, 1, 1, 'LT-2609-001', 4800, 4120, 'AVAILABLE', 24, 240],
  [2, 2, 3, 'LT-2609-002', 3600, 3390, 'AVAILABLE', 22, 210],
  [3, 3, 2, 'LT-2609-003', 5200, 4460, 'AVAILABLE', 20, 300],
  [4, 4, 2, 'LT-2609-004', 4100, 4100, 'AVAILABLE', 15, 300],
  [5, 5, 3, 'LT-2609-005', 2400, 1650, 'AVAILABLE', 18, 90],
  [6, 6, 1, 'LT-2609-006', 3000, 2780, 'AVAILABLE', 14, 180],
  [7, 7, 3, 'LT-2609-007', 3300, 2950, 'AVAILABLE', 12, 200],
  [8, 8, 4, 'LT-2609-008', 800, 640, 'AVAILABLE', 10, 365],
  [9, 1, 5, 'LT-2609-009', 6000, 5770, 'AVAILABLE', 8, 240],
  [10, 3, 2, 'LT-2609-010', 4400, 4400, 'AVAILABLE', 5, 300],
  [11, 5, 3, 'LT-2609-011', 2000, 1985, 'AVAILABLE', 3, 90],
  [12, 2, 1, 'LT-2609-012', 2500, 0, 'DEPLETED', 45, 210],
  [13, 6, 1, 'LT-2609-101', 3000, 0, 'EXPECTED', 0, 180],
  [14, 4, 2, 'LT-2609-102', 3500, 0, 'EXPECTED', 0, 300],
];
const productBatches = batchSpecs.map(([id, productId, zoneId, batchNumber, initialQty, currentQty, status, receivedDaysAgo, shelfLifeDays]) => ({
  id, productId, zoneId, batchNumber, initialQty, currentQty, status,
  receivedAt: status === 'EXPECTED' ? null : dayAgo(receivedDaysAgo, 8),
  expirationDate: inDays(shelfLifeDays - receivedDaysAgo),
}));

const wasteSpecs = [
  [1, 3, 30, 'Dented bottles during forklift handling', 26],
  [2, 3, 12, 'Leaking caps detected at pallet inspection', 22],
  [3, 5, 60, 'Pallet fell during loading', 19],
  [4, 6, 18, 'Label damage / not sellable', 17],
  [5, 3, 25, 'Bottles crushed by pallet stacking', 14],
  [6, 8, 8, 'Damaged returnable bidons', 11],
  [7, 1, 45, 'Water leak in the storage area', 9],
  [8, 3, 20, 'Expired promotional packaging', 6],
  [9, 5, 15, 'Broken bottles during unloading', 3],
  [10, 3, 10, 'Damaged cases in the picking area', 1],
];
const wasteBatchMap = { 1: 3, 2: 3, 3: 5, 4: 6, 5: 3, 6: 8, 7: 1, 8: 3, 9: 5, 10: 3 };
const wasteRecords = wasteSpecs.map(([id, userId, quantity, reason, d]) => ({
  id, batchId: wasteBatchMap[id], userId: userId === 3 ? 3 : userId, quantity, reason, reportedDate: dayOnly(d),
}));

const reconciliations = [];
for (let i = 0; i < 6; i++) {
  const d = 27 - i * 5;
  const matched = 11 - (i % 3 === 1 ? 1 : 0);
  reconciliations.push({
    id: i + 1, date: dayOnly(d), status: 'RECONCILED', totalBatches: 11, matchedBatches: matched,
    eriPercentage: Math.round((matched / 11) * 1000) / 10, confirmedBy: 2, confirmedAt: dayAgo(d, 17),
  });
}
reconciliations.push({
  id: 7, date: dayOnly(1), status: 'IN_REVIEW', totalBatches: 11, matchedBatches: 10,
  eriPercentage: 90.9, confirmedBy: null, confirmedAt: null,
});
const inventoryDiscrepancies = [
  { id: 1, reconciliationId: 7, batchId: 9, expectedQty: 5770, countedQty: 5752, status: 'OPEN', detectedAt: dayAgo(1, 18), resolvedAt: null, resolutionNote: null },
];

const deliveryDestinations = [
  { id: 1, clientName: 'Supermercados Metro San Miguel', address: 'Av. La Marina 2000, San Miguel', latitude: -12.0770, longitude: -77.0910, region: 'Lima Centro' },
  { id: 2, clientName: 'Tambo+ Miraflores', address: 'Av. Larco 1180, Miraflores', latitude: -12.1211, longitude: -77.0297, region: 'Lima Sur' },
  { id: 3, clientName: 'Wong Surco', address: 'Av. Primavera 1240, Surco', latitude: -12.1450, longitude: -76.9930, region: 'Lima Sur' },
  { id: 4, clientName: 'Plaza Vea Comas', address: 'Av. Túpac Amaru 4800, Comas', latitude: -11.9370, longitude: -77.0560, region: 'Lima Norte' },
  { id: 5, clientName: 'Tottus Independencia', address: 'Av. Alfredo Mendiola 1200, Independencia', latitude: -11.9930, longitude: -77.0590, region: 'Lima Norte' },
  { id: 6, clientName: 'Terminal Portuario Callao', address: 'Av. Contralmirante Mora 100, Callao', latitude: -12.0560, longitude: -77.1180, region: 'Callao' },
  { id: 7, clientName: 'Mercado Mayorista La Parada', address: 'Av. Aviación 1500, La Victoria', latitude: -12.0640, longitude: -77.0100, region: 'Lima Centro' },
  { id: 8, clientName: 'Hiper Chosica', address: 'Carretera Central Km 26, Chosica', latitude: -11.9330, longitude: -76.6970, region: 'Lima Este' },
];

const drivers = [
  { id: 1, fullName: 'Luis Fernández', licenseNumber: 'Q41258963', status: 'ACTIVE' },
  { id: 2, fullName: 'Roberto Quispe', licenseNumber: 'Q30214785', status: 'ACTIVE' },
  { id: 3, fullName: 'Miguel Ángel Torres', licenseNumber: 'Q52147896', status: 'ACTIVE' },
  { id: 4, fullName: 'Diego Ramírez', licenseNumber: 'Q47896321', status: 'ACTIVE' },
  { id: 5, fullName: 'Pablo Huamán', licenseNumber: 'Q36985214', status: 'ACTIVE' },
  { id: 6, fullName: 'Andrés Castillo', licenseNumber: 'Q25896314', status: 'ON_LEAVE' },
];

const transportVehicles = [
  { id: 1, driverId: 1, plateNumber: 'BTV-101', maxCapacity: 12000, isAvailable: false },
  { id: 2, driverId: 2, plateNumber: 'BTV-102', maxCapacity: 12000, isAvailable: true },
  { id: 3, driverId: 3, plateNumber: 'BTV-103', maxCapacity: 8000, isAvailable: false },
  { id: 4, driverId: 4, plateNumber: 'BTV-104', maxCapacity: 8000, isAvailable: false },
  { id: 5, driverId: 5, plateNumber: 'BTV-105', maxCapacity: 15000, isAvailable: false },
  { id: 6, driverId: 6, plateNumber: 'BTV-106', maxCapacity: 15000, isAvailable: true },
];

const deviceModels = [
  { id: 1, name: 'TrackNode T100', manufacturer: 'Teltonika', sensors: 'GPS, Temperature' },
  { id: 2, name: 'ColdSense C200', manufacturer: 'Queclink', sensors: 'GPS, Temperature, Humidity' },
];

const telemetryDevices = [
  { id: 1, vehicleId: 1, modelId: 1, deviceCode: 'IOT-1001', installedAt: dayAgo(100), isActive: true, connectionStatus: 'CONNECTED', lastSignalAt: minAgo(2) },
  { id: 2, vehicleId: 2, modelId: 1, deviceCode: 'IOT-1002', installedAt: dayAgo(100), isActive: true, connectionStatus: 'CONNECTED', lastSignalAt: minAgo(1) },
  { id: 3, vehicleId: 3, modelId: 2, deviceCode: 'IOT-1003', installedAt: dayAgo(90), isActive: true, connectionStatus: 'DISCONNECTED', lastSignalAt: minAgo(47) },
  { id: 4, vehicleId: 4, modelId: 2, deviceCode: 'IOT-1004', installedAt: dayAgo(90), isActive: true, connectionStatus: 'CONNECTED', lastSignalAt: minAgo(4) },
  { id: 5, vehicleId: 5, modelId: 1, deviceCode: 'IOT-1005', installedAt: dayAgo(60), isActive: true, connectionStatus: 'DISCONNECTED', lastSignalAt: minAgo(12) },
  { id: 6, vehicleId: 6, modelId: 2, deviceCode: 'IOT-1006', installedAt: dayAgo(40), isActive: true, connectionStatus: 'CONNECTED', lastSignalAt: minAgo(3) },
];

const disconnectionPeriods = [
  { id: 1, deviceId: 3, startedAt: minAgo(47), endedAt: null, dataStatus: 'AVAILABLE' },
  { id: 2, deviceId: 5, startedAt: minAgo(12), endedAt: null, dataStatus: 'AVAILABLE' },
  { id: 3, deviceId: 1, startedAt: dayAgo(2, 14), endedAt: dayAgo(2, 15), dataStatus: 'AVAILABLE' },
  { id: 4, deviceId: 2, startedAt: dayAgo(5, 9), endedAt: dayAgo(5, 10), dataStatus: 'UNAVAILABLE' },
];

const ORIGIN = { name: 'BevTrace Central Warehouse - Ate', lat: -12.0433, lng: -76.942 };
const lerp = (a, b, t) => a + (b - a) * t;

const orderSpecs = [
  { id: 1, dest: 1, vehicle: 2, status: 'DELIVERED', priority: 'STANDARD', daysAgo: 55, requested: 1200, delivered: 1200, late: 0 },
  { id: 2, dest: 4, vehicle: 1, status: 'DELIVERED', priority: 'STANDARD', daysAgo: 50, requested: 900, delivered: 870, late: 0 },
  { id: 3, dest: 2, vehicle: 4, status: 'DELIVERED', priority: 'URGENT', daysAgo: 44, requested: 600, delivered: 600, late: 1500 },
  { id: 4, dest: 6, vehicle: 5, status: 'DELIVERED', priority: 'LOGISTICS', daysAgo: 38, requested: 2000, delivered: 2000, late: 0 },
  { id: 5, dest: 3, vehicle: 2, status: 'DELIVERED', priority: 'STANDARD', daysAgo: 31, requested: 800, delivered: 760, late: 0 },
  { id: 6, dest: 5, vehicle: 1, status: 'DELIVERED', priority: 'STANDARD', daysAgo: 25, requested: 1500, delivered: 1500, late: 0 },
  { id: 7, dest: 7, vehicle: 4, status: 'DELIVERED', priority: 'LOGISTICS', daysAgo: 19, requested: 2400, delivered: 2400, late: 1560 },
  { id: 8, dest: 8, vehicle: 5, status: 'DELIVERED', priority: 'STANDARD', daysAgo: 14, requested: 1000, delivered: 1000, late: 0 },
  { id: 9, dest: 1, vehicle: 2, status: 'DELIVERED', priority: 'URGENT', daysAgo: 9, requested: 700, delivered: 700, late: 0 },
  { id: 10, dest: 4, vehicle: 1, status: 'DELIVERED', priority: 'STANDARD', daysAgo: 4, requested: 1100, delivered: 1050, late: 0 },
  { id: 11, dest: 2, vehicle: 1, status: 'IN_TRANSIT', priority: 'URGENT', daysAgo: 0, requested: 900, delivered: null, late: 0 },
  { id: 12, dest: 5, vehicle: 3, status: 'IN_TRANSIT', priority: 'STANDARD', daysAgo: 0, requested: 1400, delivered: null, late: 0 },
  { id: 13, dest: 3, vehicle: 4, status: 'AUTHORIZED', priority: 'LOGISTICS', daysAgo: 0, requested: 1000, delivered: null, late: 0 },
  { id: 14, dest: 6, vehicle: 5, status: 'AUTHORIZED', priority: 'STANDARD', daysAgo: 0, requested: 1600, delivered: null, late: 0 },
  { id: 15, dest: 1, vehicle: null, status: 'SCHEDULED', priority: 'STANDARD', daysAgo: 0, requested: 1200, delivered: null, late: 0 },
  { id: 16, dest: 7, vehicle: null, status: 'SCHEDULED', priority: 'LOGISTICS', daysAgo: 0, requested: 900, delivered: null, late: 0 },
  { id: 17, dest: 8, vehicle: null, status: 'SCHEDULED', priority: 'URGENT', daysAgo: 0, requested: 600, delivered: null, late: 0 },
];

const batchByOrder = { 1: [1], 2: [2], 3: [3], 4: [3, 4], 5: [5], 6: [6], 7: [7], 8: [9], 9: [1], 10: [2], 11: [3], 12: [7], 13: [9], 14: [4, 10], 15: [1], 16: [6], 17: [11] };

const dispatchOrders = [];
const cargoAssignments = [];
let cargoId = 1;
orderSpecs.forEach((o) => {
  const inFuture = ['AUTHORIZED', 'SCHEDULED'].includes(o.status);
  const scheduled = inFuture ? inDays(o.status === 'AUTHORIZED' ? 0 : 1 + (o.id % 3)) : dayOnly(o.daysAgo);
  const delivered = o.status === 'DELIVERED';
  const departedMs = o.status === 'IN_TRANSIT' ? now - (o.id === 11 ? 95 : 150) * 60000 : delivered ? new Date(scheduled + 'T07:00:00Z').getTime() : null;
  const deliveredAt = delivered ? iso(new Date(scheduled + 'T15:00:00Z').getTime() + o.late * 60000) : null;
  dispatchOrders.push({
    id: o.id,
    managerId: o.id % 2 === 0 ? 2 : 4,
    vehicleId: o.vehicle,
    destinationId: o.dest,
    scheduledDate: scheduled,
    status: o.status,
    priority: o.priority,
    estimatedWeight: Math.round(o.requested * 1.1 * 10) / 10,
    requestedQuantity: o.requested,
    deliveredQuantity: o.delivered,
    deliveredAt,
    departedAt: departedMs ? iso(departedMs) : null,
    cargoValidated: ['IN_TRANSIT', 'DELIVERED'].includes(o.status) || o.id === 14,
    createdAt: iso(new Date(scheduled + 'T00:00:00Z').getTime() - 2 * 86400000),
  });
  const batches = batchByOrder[o.id];
  batches.forEach((batchId, idx) => {
    const quantity = Math.round(o.requested / batches.length);
    cargoAssignments.push({
      id: cargoId++, dispatchOrderId: o.id, batchId, quantity,
      totalWeight: Math.round(quantity * 1.1 * 10) / 10,
      palletCount: Math.max(1, Math.round(quantity / 400)),
    });
  });
});

const routeNames = [
  ['Av. Javier Prado Checkpoint', 'Vía Expresa Checkpoint'],
  ['Av. Nicolás Ayllón Checkpoint', 'Panamericana Checkpoint'],
];
const traceabilityLogs = [];
const routeCheckpoints = [];
const deliveryRecords = [];
let checkpointId = 1;
let logId = 1;

const buildLog = (order, reachedCount, completed, minutesSinceDeparture) => {
  const dest = deliveryDestinations.find((d) => d.id === order.destinationId);
  const vehicle = transportVehicles.find((v) => v.id === order.vehicleId);
  const device = telemetryDevices.find((d) => d.vehicleId === order.vehicleId);
  const names = routeNames[order.id % 2];
  const points = [
    { name: ORIGIN.name + ' - Departure', lat: ORIGIN.lat, lng: ORIGIN.lng },
    { name: names[0], lat: lerp(ORIGIN.lat, dest.latitude, 0.33), lng: lerp(ORIGIN.lng, dest.longitude, 0.33) },
    { name: names[1], lat: lerp(ORIGIN.lat, dest.latitude, 0.66), lng: lerp(ORIGIN.lng, dest.longitude, 0.66) },
    { name: dest.clientName, lat: dest.latitude, lng: dest.longitude },
  ];
  const departed = new Date(order.departedAt).getTime();
  const currentPoint = points[Math.max(0, reachedCount - 1)];
  const log = {
    id: logId,
    dispatchOrderId: order.id,
    currentStatus: completed ? 'COMPLETED' : 'IN_TRANSIT',
    startTime: order.departedAt,
    endTime: completed ? order.deliveredAt : null,
    estimatedArrival: iso(departed + 240 * 60000),
    currentLatitude: currentPoint.lat,
    currentLongitude: currentPoint.lng,
    rejectionReason: null,
    orderPriority: order.priority,
    destinationName: dest.clientName,
    vehiclePlate: vehicle.plateNumber,
    deviceId: device ? device.id : null,
  };
  traceabilityLogs.push(log);
  points.forEach((p, i) => {
    const reached = i < reachedCount;
    routeCheckpoints.push({
      id: checkpointId++, logId, sequence: i + 1, locationName: p.name, latitude: p.lat, longitude: p.lng,
      status: reached ? 'REACHED' : 'PENDING',
      reachedAt: reached ? iso(departed + i * 55 * 60000) : null,
      observation: null,
    });
  });
  if (completed) {
    deliveryRecords.push({
      id: deliveryRecords.length + 1, logId, receivedBy: 'Store Manager - ' + dest.clientName,
      signatureUrl: null, deliveredAt: order.deliveredAt, status: 'DELIVERED', rejectionReason: null,
    });
  }
  logId++;
};

buildLog(dispatchOrders.find((o) => o.id === 11), 2, false);
buildLog(dispatchOrders.find((o) => o.id === 12), 3, false);
[7, 8, 9, 10].forEach((id) => buildLog(dispatchOrders.find((o) => o.id === id), 4, true));

const locationStreams = [];
let streamId = 1;
const addStreams = (deviceId, orderId, count, lastTemp, startMinAgo) => {
    const order = dispatchOrders.find((o) => o.id === orderId);
  const dest = deliveryDestinations.find((d) => d.id === order.destinationId);
  for (let i = 0; i < count; i++) {
    const t = (i + 1) / (count + 2);
    locationStreams.push({
      id: streamId++, deviceId,
      latitude: Math.round(lerp(ORIGIN.lat, dest.latitude, t * 0.7) * 1e6) / 1e6,
      longitude: Math.round(lerp(ORIGIN.lng, dest.longitude, t * 0.7) * 1e6) / 1e6,
      speed: 32 + ((i * 7) % 18),
      temperature: i === count - 1 ? lastTemp : 24 + (i % 4),
      timestamp: minAgo(startMinAgo - i * 10),
    });
  }
};
addStreams(1, 11, 8, 34.5, 80);
addStreams(3, 12, 8, 27.5, 140);
[2, 4, 5, 6].forEach((deviceId) => {
  for (let i = 0; i < 3; i++) {
    locationStreams.push({
      id: streamId++, deviceId, latitude: -12.0433 + i * 0.003, longitude: -76.942 + i * 0.003,
      speed: 0, temperature: 23 + i, timestamp: minAgo(60 - i * 15),
    });
  }
});

const alertRules = [
  { id: 1, conditionType: 'TEMPERATURE_MAX', threshold: 30, severity: 'HIGH', description: 'Cargo temperature above the allowed maximum', active: true },
  { id: 2, conditionType: 'DELAY_MINUTES', threshold: 45, severity: 'MEDIUM', description: 'Shipment delayed beyond the estimated arrival', active: true },
  { id: 3, conditionType: 'SIGNAL_LOSS_MINUTES', threshold: 30, severity: 'CRITICAL', description: 'IoT device without signal for a prolonged period', active: true },
];

const incidentRecords = [
  { id: 1, logId: 2, ruleId: 3, anomalyType: 'SIGNAL_LOSS_MINUTES', severity: 'CRITICAL', status: 'OPEN', detectedAt: minAgo(17), description: 'Device IOT-1003 has not reported signal for over 30 minutes.', acknowledgedBy: null, acknowledgedAt: null, resolvedAt: null, reopenCount: 0 },
  { id: 2, logId: 1, ruleId: 2, anomalyType: 'DELAY_MINUTES', severity: 'MEDIUM', status: 'ACKNOWLEDGED', detectedAt: minAgo(90), description: 'Shipment to Tambo+ Miraflores is delayed against the estimated route time.', acknowledgedBy: 2, acknowledgedAt: minAgo(70), resolvedAt: null, reopenCount: 0 },
  { id: 3, logId: 5, ruleId: 1, anomalyType: 'TEMPERATURE_MAX', severity: 'HIGH', status: 'RESOLVED', detectedAt: minAgo(600), description: 'Cargo temperature reached 33.1 °C during the route.', acknowledgedBy: 2, acknowledgedAt: minAgo(590), resolvedAt: minAgo(180), reopenCount: 0 },
  { id: 4, logId: 4, ruleId: 2, anomalyType: 'DELAY_MINUTES', severity: 'MEDIUM', status: 'RESOLVED', detectedAt: dayAgo(3, 12), description: 'Delay of 120 minutes detected on route.', acknowledgedBy: 2, acknowledgedAt: dayAgo(3, 12), resolvedAt: dayAgo(3, 15), reopenCount: 0 },
];

const correctiveActions = [
  { id: 1, incidentId: 3, userId: 2, description: 'Driver moved cargo to the shaded section and adjusted ventilation.', appliedAt: minAgo(200) },
  { id: 2, incidentId: 4, userId: 2, description: 'Alternative route assigned to avoid traffic congestion.', appliedAt: dayAgo(3, 14) },
];

const notifications = [
  { id: 1, recipientRole: 'ROLE_LOGISTICS_MANAGER', type: 'INCIDENT', title: 'Signal lost', message: 'Device IOT-1003 lost connectivity while carrying dispatch #12.', createdAt: minAgo(17), read: false },
  { id: 2, recipientRole: 'ROLE_LOGISTICS_MANAGER', type: 'INVENTORY', title: 'Inventory discrepancy', message: 'Batch LT-2609-009 has a discrepancy of 18 units after the daily reconciliation.', createdAt: dayAgo(1, 18), read: false },
  { id: 3, recipientRole: 'ROLE_WAREHOUSE_OPERATOR', type: 'DISPATCH', title: 'Dispatch authorized', message: 'Dispatch #13 was authorized. Validate the loaded pallets before departure.', createdAt: minAgo(35), read: false },
  { id: 4, recipientRole: 'ROLE_LOGISTICS_MANAGER', type: 'INCIDENT', title: 'Incident resolved', message: 'The temperature incident on dispatch #9 was resolved.', createdAt: minAgo(180), read: true },
];

const logisticsReports = [
  {
    id: 1, userId: 2, periodStart: dayOnly(60), periodEnd: dayOnly(31), createdAt: dayAgo(30, 9),
    kpis: [
      { metricName: 'OTIF', actualValue: 100 }, { metricName: 'FILL_RATE', actualValue: 97.6 },
      { metricName: 'ERI', actualValue: 95.5 }, { metricName: 'INVENTORY_ROTATION', actualValue: 0.42 },
    ],
  },
];

const subscriptionPlans = [];
const planDefs = [
  { code: 'ESSENTIAL', name: 'Essential', monthly: 299, yearly: 2870, descriptionKey: 'plans.essential.description', maxRoutes: 5, maxDevices: 100, maxUsers: 5, featureKeys: ['plans.features.routes5', 'plans.features.basicQueue', 'plans.features.emailSupport', 'plans.features.dailyReports', 'plans.features.devices100'], highlighted: false, custom: false },
  { code: 'PROFESSIONAL', name: 'Professional', monthly: 699, yearly: 6710, descriptionKey: 'plans.professional.description', maxRoutes: 999, maxDevices: 500, maxUsers: 25, featureKeys: ['plans.features.routesUnlimited', 'plans.features.realtimeMap', 'plans.features.prioritySupport', 'plans.features.customKpi', 'plans.features.devices500', 'plans.features.advancedApi'], highlighted: true, custom: false },
  { code: 'ENTERPRISE', name: 'Enterprise', monthly: 0, yearly: 0, descriptionKey: 'plans.enterprise.description', maxRoutes: 9999, maxDevices: 9999, maxUsers: 999, featureKeys: ['plans.features.multiWarehouse', 'plans.features.customIntegration', 'plans.features.accountManager', 'plans.features.onPremise', 'plans.features.whiteLabel', 'plans.features.sla'], highlighted: false, custom: true },
];
let planId = 1;
planDefs.forEach((p) => {
  ['MONTHLY', 'YEARLY'].forEach((period) => {
    subscriptionPlans.push({
      id: planId++, code: p.code, name: p.name, descriptionKey: p.descriptionKey,
      priceAmount: period === 'MONTHLY' ? p.monthly : p.yearly, currency: 'PEN', billingPeriod: period,
      maxRoutes: p.maxRoutes, maxDevices: p.maxDevices, maxUsers: p.maxUsers,
      featureKeys: p.featureKeys, highlighted: p.highlighted, custom: p.custom, active: true,
    });
  });
});

const subscriptions = [
  { id: 1, userId: 2, companyName: 'BevTrace Demo Distribuidora', planCode: 'PROFESSIONAL', billingCycle: 'MONTHLY', status: 'ACTIVE', currentPeriodStart: dayAgo(12), currentPeriodEnd: dayAgo(-18), cancelledAt: null },
  { id: 2, userId: 4, companyName: 'Andina Beverages S.A.C.', planCode: 'ESSENTIAL', billingCycle: 'YEARLY', status: 'ACTIVE', currentPeriodStart: dayAgo(100), currentPeriodEnd: dayAgo(-265), cancelledAt: null },
  { id: 3, userId: 5, companyName: 'Andina Beverages S.A.C.', planCode: 'PROFESSIONAL', billingCycle: 'MONTHLY', status: 'PAST_DUE', currentPeriodStart: dayAgo(35), currentPeriodEnd: dayAgo(5), cancelledAt: null },
];

const payments = [
  { id: 1, subscriptionId: 1, amount: 699, currency: 'PEN', status: 'PAID', cardLast4: '4242', paidAt: dayAgo(12) },
  { id: 2, subscriptionId: 1, amount: 699, currency: 'PEN', status: 'PAID', cardLast4: '4242', paidAt: dayAgo(42) },
  { id: 3, subscriptionId: 2, amount: 2870, currency: 'PEN', status: 'PAID', cardLast4: '1881', paidAt: dayAgo(100) },
  { id: 4, subscriptionId: 3, amount: 699, currency: 'PEN', status: 'FAILED', cardLast4: '0002', paidAt: dayAgo(5) },
];

const newsletterSubscribers = [
  { id: 1, email: 'compras@distribuidoralima.pe', subscribedAt: dayAgo(20) },
  { id: 2, email: 'logistica@embotelladora.pe', subscribedAt: dayAgo(9) },
];

const contactRequests = [
  { id: 1, fullName: 'Rosa Medina', email: 'rmedina@bebidasdelsur.pe', company: 'Bebidas del Sur', message: 'We would like a live demo for our 3 warehouses.', createdAt: dayAgo(6) },
];

const db = {
  roles, users, products, zones: warehouseZones, batches: productBatches,
  'waste-records': wasteRecords, reconciliations,
  discrepancies: inventoryDiscrepancies, destinations: deliveryDestinations,
  drivers, vehicles: transportVehicles, models: deviceModels,
  devices: telemetryDevices, 'disconnection-periods': disconnectionPeriods,
  'dispatch-orders': dispatchOrders, 'cargo-assignments': cargoAssignments,
  logs: traceabilityLogs, 'route-checkpoints': routeCheckpoints,
  'delivery-records': deliveryRecords, 'location-streams': locationStreams,
  rules: alertRules, incidents: incidentRecords,
  'corrective-actions': correctiveActions, notifications,
  'logistics-reports': logisticsReports, 'subscription-plans': subscriptionPlans,
  subscriptions, payments, 'newsletter-subscribers': newsletterSubscribers,
  'contact-requests': contactRequests,
};

const target = join(dirname(fileURLToPath(import.meta.url)), 'db.json');
writeFileSync(target, JSON.stringify(db, null, 2) + '\n');
console.log(`BevTrace db.json generated at ${target}`);
