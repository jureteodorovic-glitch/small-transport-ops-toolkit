export interface InvoiceNumberOptions {
  year?: number;
}

export interface ParsedInvoiceNumber {
  serial: number;
  year: number;
}

function assertValidSerial(serial: number): void {
  if (!Number.isInteger(serial) || serial < 1 || serial > 999) {
    throw new Error("invoice serial must be an integer from 1 to 999.");
  }
}

function assertValidYear(year: number): void {
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    throw new Error("invoice year must be a four digit year.");
  }
}

function currentYear(): number {
  return new Date().getFullYear();
}

export function normalizeInvoiceNumber(
  input: string | number,
  options: InvoiceNumberOptions = {}
): string {
  if (typeof input === "number") {
    assertValidSerial(input);

    const year = options.year ?? currentYear();
    assertValidYear(year);

    return `${String(input).padStart(3, "0")}/${year}`;
  }

  const value = input.trim();

  if (value.length === 0) {
    throw new Error("invoice number is required.");
  }

  const match = /^(\d+)(?:\s*\/\s*(\d{4}))?$/.exec(value);

  if (!match) {
    if ((value.match(/\//g) ?? []).length > 1) {
      throw new Error("invoice number must be a serial or serial/year value.");
    }

    if (value.includes("/") && !/\/\s*\d{4}\s*$/.test(value)) {
      throw new Error("invoice year must be a four digit year.");
    }

    throw new Error("invoice number must be a serial or serial/year value.");
  }

  const serial = Number(match[1]);
  assertValidSerial(serial);

  const year = match[2] === undefined ? options.year ?? currentYear() : Number(match[2]);
  assertValidYear(year);

  return `${String(serial).padStart(3, "0")}/${year}`;
}

export function parseInvoiceNumber(input: string): ParsedInvoiceNumber {
  const normalized = normalizeInvoiceNumber(input);
  const [serialPart, yearPart] = normalized.split("/");

  return {
    serial: Number(serialPart),
    year: Number(yearPart)
  };
}

export function isValidInvoiceNumber(input: string): boolean {
  try {
    normalizeInvoiceNumber(input);
    return true;
  } catch {
    return false;
  }
}
