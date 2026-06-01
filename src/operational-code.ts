import { toServiceDateKey } from "./date-matching.js";

export interface ParsedOperationalCode {
  year: number;
  month: number;
  sequence: number;
}

function assertValidSequence(sequence: number): void {
  if (!Number.isInteger(sequence) || sequence < 1 || sequence > 999) {
    throw new Error("Operational code sequence must be an integer from 1 to 999.");
  }
}

export function formatOperationalCode(date: Date | string, sequence: number): string {
  assertValidSequence(sequence);

  const serviceDate = toServiceDateKey(date);

  if (serviceDate === null) {
    throw new Error("Operational code date must be a valid ISO calendar date.");
  }

  const year = Number(serviceDate.slice(2, 4));
  const month = serviceDate.slice(5, 7);

  return `${String(year).padStart(2, "0")}${month}${String(sequence).padStart(3, "0")}`;
}

export function parseOperationalCode(code: string): ParsedOperationalCode {
  if (!/^\d{7}$/.test(code)) {
    throw new Error("Operational code must contain exactly 7 digits.");
  }

  const year = 2000 + Number(code.slice(0, 2));
  const month = Number(code.slice(2, 4));
  const sequence = Number(code.slice(4, 7));

  if (month < 1 || month > 12) {
    throw new Error("Operational code month must be between 01 and 12.");
  }

  assertValidSequence(sequence);

  return { year, month, sequence };
}

export function isValidOperationalCode(code: string): boolean {
  try {
    parseOperationalCode(code);
    return true;
  } catch {
    return false;
  }
}
