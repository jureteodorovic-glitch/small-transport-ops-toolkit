# small-transport-ops-toolkit

A small TypeScript utility library for generic transport operations workflows.

It provides helpers for operational code generation, invoice number normalization, service-date matching, grouping rides by invoice number, and validating ride/invoice links.

## What This Package Is

- A lightweight library for small transport operators and transport-adjacent admin tools.
- A set of deterministic helpers with no database, no web UI, and no private dependencies.
- A public, generic toolkit intended to be easy to test and reuse.

## What This Package Is Not

- It is not a route optimization engine.
- It is not accounting software.
- It is not a dispatching platform.
- It does not contain private transport company data, private business logic, real driver names, real vehicle registrations, real customer names, school names, phone numbers, emails, or internal routes.

## Installation

```bash
npm install small-transport-ops-toolkit
```

The package is intended for public npm publishing. Until published, install from a local checkout or Git repository.

## Usage

### Operational Transport Codes

Codes use `YYMM` plus a three-digit monthly sequence.

```ts
import {
  formatOperationalCode,
  isValidOperationalCode,
  parseOperationalCode
} from "small-transport-ops-toolkit";

formatOperationalCode("2026-05-01", 1);
// "2605001"

formatOperationalCode("2027-01-03", 12);
// "2701012"

parseOperationalCode("2605007");
// { year: 2026, month: 5, sequence: 7 }

isValidOperationalCode("2605007");
// true
```

### Invoice Number Normalization

Invoice numbers normalize to `NNN/YYYY`.

```ts
import {
  isValidInvoiceNumber,
  normalizeInvoiceNumber,
  parseInvoiceNumber
} from "small-transport-ops-toolkit";

normalizeInvoiceNumber(75, { year: 2026 });
// "075/2026"

normalizeInvoiceNumber(" 75 / 2026 ");
// "075/2026"

parseInvoiceNumber("075/2026");
// { serial: 75, year: 2026 }

isValidInvoiceNumber("075/2026");
// true
```

If a year is missing, `normalizeInvoiceNumber` uses `options.year` or the current system year.

### Transport Date Matching

`isSameServiceDate` compares calendar dates only. For ISO date-time strings, it uses the calendar date portion of the string. For `Date` objects, it uses the UTC calendar date.

```ts
import { isSameServiceDate } from "small-transport-ops-toolkit";

isSameServiceDate("2026-05-01", "2026-05-01T12:00:00+02:00");
// true

isSameServiceDate(new Date("2026-05-01T08:00:00Z"), new Date("2026-05-01T18:00:00Z"));
// true
```

### Invoice Grouping

Grouping normalizes invoice numbers where possible. Rides with missing or invalid invoice numbers are excluded from groups and can be retrieved with `getUnlinkedRides`.

```ts
import { getUnlinkedRides, groupRidesByInvoice } from "small-transport-ops-toolkit";

const rides = [
  { id: "ride-1", invoiceNumber: "75/2026" },
  { id: "ride-2", invoiceNumber: "075/2026" },
  { id: "ride-3", invoiceNumber: null },
  { id: "ride-4", invoiceNumber: "1000/2026" }
];

groupRidesByInvoice(rides);
// [{ invoiceNumber: "075/2026", rides: [rides[0], rides[1]] }]

getUnlinkedRides(rides);
// [rides[2], rides[3]]
```

### Ride/Invoice Validation

The validator returns errors instead of throwing.

```ts
import { validateRideInvoiceLink } from "small-transport-ops-toolkit";

validateRideInvoiceLink({
  rideDate: "2026-05-01",
  invoiceServiceDate: "2026-05-01",
  invoiceNumber: "75/2026"
});
// {
//   valid: true,
//   errors: [],
//   normalizedInvoiceNumber: "075/2026"
// }
```

## API Overview

### Operational Codes

- `formatOperationalCode(date: Date | string, sequence: number): string`
- `parseOperationalCode(code: string): { year: number; month: number; sequence: number }`
- `isValidOperationalCode(code: string): boolean`

### Invoice Numbers

- `normalizeInvoiceNumber(input: string | number, options?: { year?: number }): string`
- `parseInvoiceNumber(input: string): { serial: number; year: number }`
- `isValidInvoiceNumber(input: string): boolean`

### Date Matching

- `isSameServiceDate(rideDate: Date | string, invoiceServiceDate: Date | string): boolean`

### Invoice Grouping

- `groupRidesByInvoice<T extends { invoiceNumber?: string | null }>(rides: T[]): Array<{ invoiceNumber: string; rides: T[] }>`
- `getUnlinkedRides<T extends { invoiceNumber?: string | null }>(rides: T[]): T[]`

### Validation

- `validateRideInvoiceLink(input): { valid: boolean; errors: string[]; normalizedInvoiceNumber?: string }`

## Development

```bash
npm install
npm test
npm run typecheck
npm run build
```

## Roadmap

- Add optional stricter invoice year ranges.
- Add configurable operational code century handling.
- Add helpers for lightweight reconciliation reports.
- Add more date parsing documentation for local-time workflows.

## Contributing

Contributions are welcome if they keep the package generic, small, tested, and safe for public open-source use. See `CONTRIBUTING.md`.

## Safety and Privacy

This project contains no private transport company data. Examples are generic and fictional. Do not add real names, real registrations, customer data, internal routes, phone numbers, emails, or private business logic.

## License

MIT. See `LICENSE`.
