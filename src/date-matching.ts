function isValidCalendarDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

export function toServiceDateKey(input: Date | string): string | null {
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) {
      return null;
    }

    const year = input.getUTCFullYear();
    const month = String(input.getUTCMonth() + 1).padStart(2, "0");
    const day = String(input.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const value = input.trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!isValidCalendarDate(year, month, day)) {
    return null;
  }

  return `${match[1]}-${match[2]}-${match[3]}`;
}

export function isSameServiceDate(
  rideDate: Date | string,
  invoiceServiceDate: Date | string
): boolean {
  const rideKey = toServiceDateKey(rideDate);
  const invoiceKey = toServiceDateKey(invoiceServiceDate);

  return rideKey !== null && invoiceKey !== null && rideKey === invoiceKey;
}
