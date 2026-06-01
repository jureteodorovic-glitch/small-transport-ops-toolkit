import { describe, expect, it, vi } from "vitest";
import {
  isValidInvoiceNumber,
  normalizeInvoiceNumber,
  parseInvoiceNumber
} from "../src/invoice-normalizer.js";

describe("invoice number normalization", () => {
  it("normalizes serial-only invoice numbers with the provided year", () => {
    expect(normalizeInvoiceNumber(75, { year: 2026 })).toBe("075/2026");
    expect(normalizeInvoiceNumber("75", { year: 2026 })).toBe("075/2026");
    expect(normalizeInvoiceNumber("075", { year: 2026 })).toBe("075/2026");
  });

  it("normalizes invoice numbers that already contain a year", () => {
    expect(normalizeInvoiceNumber("075/2026")).toBe("075/2026");
    expect(normalizeInvoiceNumber(" 75 / 2026 ")).toBe("075/2026");
  });

  it("uses the current year when no year is provided", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2030-04-10T12:00:00Z"));

    expect(normalizeInvoiceNumber("8")).toBe("008/2030");

    vi.useRealTimers();
  });

  it("parses normalized or normalizable invoice numbers", () => {
    expect(parseInvoiceNumber("075/2026")).toEqual({ serial: 75, year: 2026 });
    expect(parseInvoiceNumber("75 / 2026")).toEqual({ serial: 75, year: 2026 });
  });

  it("rejects invalid invoice inputs with clear errors", () => {
    expect(() => normalizeInvoiceNumber("", { year: 2026 })).toThrow("invoice number");
    expect(() => normalizeInvoiceNumber("0", { year: 2026 })).toThrow("serial");
    expect(() => normalizeInvoiceNumber("1000", { year: 2026 })).toThrow("serial");
    expect(() => normalizeInvoiceNumber("12.5", { year: 2026 })).toThrow("serial");
    expect(() => normalizeInvoiceNumber("075/26")).toThrow("year");
    expect(() => normalizeInvoiceNumber("075/abcd")).toThrow("year");
    expect(() => normalizeInvoiceNumber("075/2026/1")).toThrow("invoice number");
  });

  it("reports validity without throwing", () => {
    expect(isValidInvoiceNumber("075/2026")).toBe(true);
    expect(isValidInvoiceNumber("75 / 2026")).toBe(true);
    expect(isValidInvoiceNumber("1000/2026")).toBe(false);
    expect(isValidInvoiceNumber("075/26")).toBe(false);
  });
});
