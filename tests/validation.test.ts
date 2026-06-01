import { describe, expect, it } from "vitest";
import { validateRideInvoiceLink } from "../src/validation.js";

describe("ride invoice link validation", () => {
  it("returns valid with a normalized invoice number when date and invoice match", () => {
    expect(
      validateRideInvoiceLink({
        rideDate: "2026-05-01",
        invoiceServiceDate: "2026-05-01T12:00:00+02:00",
        invoiceNumber: "75/2026"
      })
    ).toEqual({
      valid: true,
      errors: [],
      normalizedInvoiceNumber: "075/2026"
    });
  });

  it("returns errors instead of throwing for invalid invoice numbers", () => {
    const result = validateRideInvoiceLink({
      rideDate: "2026-05-01",
      invoiceServiceDate: "2026-05-01",
      invoiceNumber: "1000/2026"
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Invalid invoice number: invoice serial must be an integer from 1 to 999.");
    expect(result.normalizedInvoiceNumber).toBeUndefined();
  });

  it("returns an error when service dates do not match", () => {
    expect(
      validateRideInvoiceLink({
        rideDate: "2026-05-01",
        invoiceServiceDate: "2026-05-02",
        invoiceNumber: "075/2026"
      })
    ).toEqual({
      valid: false,
      errors: ["Ride date and invoice service date must be the same calendar date."],
      normalizedInvoiceNumber: "075/2026"
    });
  });

  it("can return multiple validation errors", () => {
    const result = validateRideInvoiceLink({
      rideDate: "bad-date",
      invoiceServiceDate: "2026-05-02",
      invoiceNumber: "abc"
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});
