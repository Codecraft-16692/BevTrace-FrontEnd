# BevTrace Frontend

Angular frontend for BevTrace, a beverage logistics and traceability platform covering inventory, dispatch, traceability, IoT telemetry, incidents, analytics and subscriptions.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.8.

## Getting started

Install the dependencies:

```bash
npm install
```

Start the mock API (json-server) at `http://localhost:3000`, backed by `server/db.json`:

```bash
npm run api
```

In a second terminal, start the development server:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

To regenerate the sample data with dates relative to today (recommended before a demo):

```bash
node server/seed.mjs
```

## Test credentials

| Role | Email | Password |
|---|---|---|
| Administrator | bevtrace@admin.com | Admin1234 |
| Logistics Manager | alex.rivera@bevtrace.com | Logistics1 |
| Warehouse Operator | maria.paz@bevtrace.com | Warehouse1 |

## Bounded contexts

| Folder | Contents |
|---|---|
| `iam` | Sign in, sign up, users and roles (admin) |
| `inventory` | Catalog and shrinkage, batch intake by code, shrinkage logging, reconciliation and discrepancies |
| `dispatch` | Dispatch queue, scheduling, classification, vehicle assignment, pallet validation, departure |
| `traceability` | Active routes map, checkpoints, delivery / rejection, history |
| `telemetry` | Connectivity dashboard (critical > 30 min), provisioning, IoT simulator |
| `incident` | Anomaly detection, rules, incidents, corrective actions, notifications |
| `analytics` | KPI dashboard (OTIF, Fill Rate, ERI, rotation, shrinkage) and reports with CSV export |
| `subscription` | Plans, simulated payment, billing, newsletter, contact and admin view |
| `shared` | Layout, public bar, language switcher, landing page, dashboard, common components |

Each bounded context follows a DDD layered structure: `domain`, `application`, `infrastructure` and `presentation`.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
