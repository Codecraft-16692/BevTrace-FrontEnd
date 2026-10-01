# BevTrace Frontend

Frontend Angular del proyecto **BevTrace** (CodeCraft, UPC), construido con la arquitectura de la guía *ClosedSource*:
DDD, un bounded context por carpeta y cada uno dividido en `domain / application / infrastructure / presentation`.

## Puesta en marcha

```bash
npm install
npm run api      # API mock (json-server) en http://localhost:3000  -> server/db.json
npm start        # Angular en http://localhost:4200
```

Para regenerar los datos de ejemplo con fechas relativas a hoy (recomendado antes de una demo):

```bash
node server/seed.mjs
```

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | bevtrace@admin.com | Admin1234 |
| Jefe de Logística | alex.rivera@bevtrace.com | Logistics1 |
| Operario de Almacén | maria.paz@bevtrace.com | Warehouse1 |

Reglas de seguridad: el correo debe contener `@` y dominio válido; la contraseña necesita 1 mayúscula, 1 número y más de 8 caracteres
(constante `PASSWORD_MIN_LENGTH` en `iam/domain/model/credentials-policy.ts`). Tras 5 intentos fallidos el formulario se bloquea 30 s.
Los botones y rutas se filtran por rol (`role-guard`). Las contraseñas en `db.json` son texto plano **solo porque es un mock**.

## Bounded contexts

| Carpeta | Contenido |
|---|---|
| `iam` | Inicio de sesión, registro, usuarios y roles (admin) |
| `inventory` | Catálogo y mermas, ingreso de lotes por código, registro de mermas, conciliación y discrepancias |
| `dispatch` | Cola de despachos, programación, clasificación, asignación de vehículo, validación de paletas, salida |
| `traceability` | Mapa de rutas activas, puntos de control, entrega / rechazo, historial |
| `telemetry` | Panel de conectividad (crítico > 30 min), aprovisionamiento, simulador IoT |
| `incident` | Detección de anomalías, reglas, incidentes, acciones correctivas, notificaciones |
| `analytics` | Panel de KPI (OTIF, Fill Rate, ERI, rotación, merma) y reportes con CSV |
| `subscription` | Planes, pago simulado, facturación, newsletter, contacto y vista de administración |
| `shared` | Layout, barra pública, selector de idioma, landing, dashboard, componentes comunes |

## Notas

- **Sin backend:** `json-server` sirve `server/db.json`. Como no aplica reglas de negocio, las validan las stores de `application/`
  (stock, capacidad del vehículo, paletas, conciliación pendiente, etc.). Al conectar el backend real bastará cambiar `environment.ts` y las facades `*-api.ts`.
- **Mapa:** `RouteCanvas` es un mapa esquemático SVG (sin API de mapas) alimentado con latitud y longitud.
- **i18n:** `public/i18n/en.json` y `es.json`; el idioma elegido se recuerda en el navegador.
- **Pago:** tarjeta de prueba `4242 4242 4242 4242` (aprobada) y `4000 0000 0000 0002` (rechazada). Solo se guardan los 4 últimos dígitos.
- Códigos de lote para probar el ingreso: `LT-2609-101` y `LT-2609-102`.
