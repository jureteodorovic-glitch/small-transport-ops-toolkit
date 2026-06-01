import { isSameServiceDate, toServiceDateKey } from "./date-matching.js";
import { normalizeInvoiceNumber } from "./invoice-normalizer.js";

export interface ValidateRideInvoiceLinkInput {
  rideDate: Date | string;
  invoiceServiceDate: Date | string;
  invoiceNumber: string | number;
}

export interface RideInvoiceLinkValidationResult {
  valid: boolean;
  errors: string[];
  normalizedInvoiceNumber?: string;
}

export function validateRideInvoiceLink(
  input: ValidateRideInvoiceLinkInput
): RideInvoiceLinkValidationResult {
  const errors: string[] = [];
  let normalizedInvoiceNumber: string | undefined;

  try {
    normalizedInvoiceNumber = normalizeInvoiceNumber(input.invoiceNumber);
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown invoice number error";
    errors.push(`Invalid invoice number: ${message}`);
  }

  if (
    toServiceDateKey(input.rideDate) === null ||
    toServiceDateKey(input.invoiceServiceDate) === null ||
    !isSameServiceDate(input.rideDate, input.invoiceServiceDate)
  ) {
    errors.push("Ride date and invoice service date must be the same calendar date.");
  }

  return {
    valid: errors.length === 0,
    errors,
    ...(normalizedInvoiceNumber === undefined ? {} : { normalizedInvoiceNumber })
  };
}
