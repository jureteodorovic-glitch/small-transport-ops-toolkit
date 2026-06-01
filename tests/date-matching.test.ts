import { describe, expect, it } from "vitest";
import { isSameServiceDate } from "../src/date-matching.js";

describe("transport date matching", () => {
  it("matches equal date-only strings", () => {
    expect(isSameServiceDate("2026-05-01", "2026-05-01")).toBe(true);
    expect(isSameServiceDate("2026-05-01", "2026-05-02")).toBe(false);
  });

  it("compares ISO date-time strings by their calendar date portion", () => {
    expect(isSameServiceDate("2026-05-01T23:30:00+02:00", "2026-05-01")).toBe(true);
    expect(isSameServiceDate("2026-05-01T23:30:00-03:00", "2026-05-02T01:00:00Z")).toBe(false);
  });

  it("compares Date objects by UTC calendar date", () => {
    expect(
      isSameServiceDate(
        new Date("2026-05-01T00:30:00Z"),
        new Date("2026-05-01T23:30:00Z")
      )
    ).toBe(true);
    expect(
      isSameServiceDate(
        new Date("2026-05-01T23:30:00Z"),
        new Date("2026-05-02T00:30:00Z")
      )
    ).toBe(false);
  });

  it("returns false for invalid dates", () => {
    expect(isSameServiceDate("not-a-date", "2026-05-01")).toBe(false);
    expect(isSameServiceDate(new Date("bad"), "2026-05-01")).toBe(false);
  });
});
