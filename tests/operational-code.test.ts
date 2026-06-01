import { describe, expect, it } from "vitest";
import {
  formatOperationalCode,
  isValidOperationalCode,
  parseOperationalCode
} from "../src/operational-code.js";

describe("operational code helpers", () => {
  it("formats YYMM plus a three digit monthly sequence", () => {
    expect(formatOperationalCode("2026-05-01", 1)).toBe("2605001");
    expect(formatOperationalCode("2026-05-21", 7)).toBe("2605007");
    expect(formatOperationalCode(new Date("2027-01-03T10:30:00Z"), 12)).toBe("2701012");
  });

  it("rejects sequences outside 1-999", () => {
    expect(() => formatOperationalCode("2026-05-01", 0)).toThrow("sequence");
    expect(() => formatOperationalCode("2026-05-01", 1000)).toThrow("sequence");
    expect(() => formatOperationalCode("2026-05-01", 1.5)).toThrow("sequence");
  });

  it("parses a valid operational code", () => {
    expect(parseOperationalCode("2605007")).toEqual({
      year: 2026,
      month: 5,
      sequence: 7
    });
  });

  it("rejects invalid operational codes", () => {
    expect(() => parseOperationalCode("2600001")).toThrow("month");
    expect(() => parseOperationalCode("2613001")).toThrow("month");
    expect(() => parseOperationalCode("2605000")).toThrow("sequence");
    expect(() => parseOperationalCode("26051000")).toThrow("7 digits");
    expect(() => parseOperationalCode("2605ABC")).toThrow("7 digits");
  });

  it("returns validity without throwing", () => {
    expect(isValidOperationalCode("2701012")).toBe(true);
    expect(isValidOperationalCode("9912999")).toBe(true);
    expect(isValidOperationalCode("2605000")).toBe(false);
    expect(isValidOperationalCode("2613001")).toBe(false);
  });
});
