import { normalizeInvoiceNumber } from "./invoice-normalizer.js";

export interface InvoiceRideGroup<T> {
  invoiceNumber: string;
  rides: T[];
}

function tryNormalizeInvoiceNumber(input: string | null | undefined): string | null {
  if (input === null || input === undefined || input.trim().length === 0) {
    return null;
  }

  try {
    return normalizeInvoiceNumber(input);
  } catch {
    return null;
  }
}

export function groupRidesByInvoice<T extends { invoiceNumber?: string | null }>(
  rides: T[]
): Array<InvoiceRideGroup<T>> {
  const groups = new Map<string, T[]>();

  for (const ride of rides) {
    const invoiceNumber = tryNormalizeInvoiceNumber(ride.invoiceNumber);

    if (invoiceNumber === null) {
      continue;
    }

    const group = groups.get(invoiceNumber);

    if (group === undefined) {
      groups.set(invoiceNumber, [ride]);
    } else {
      group.push(ride);
    }
  }

  return Array.from(groups, ([invoiceNumber, groupedRides]) => ({
    invoiceNumber,
    rides: groupedRides
  }));
}

export function getUnlinkedRides<T extends { invoiceNumber?: string | null }>(rides: T[]): T[] {
  return rides.filter((ride) => tryNormalizeInvoiceNumber(ride.invoiceNumber) === null);
}
