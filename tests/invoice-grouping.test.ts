import { describe, expect, it } from "vitest";
import { getUnlinkedRides, groupRidesByInvoice } from "../src/invoice-grouping.js";

describe("invoice grouping", () => {
  it("groups linked rides by normalized invoice number", () => {
    const rides = [
      { id: "a", invoiceNumber: "75/2026" },
      { id: "b", invoiceNumber: "075/2026" },
      { id: "c", invoiceNumber: "8 / 2026" }
    ];

    expect(groupRidesByInvoice(rides)).toEqual([
      { invoiceNumber: "075/2026", rides: [rides[0], rides[1]] },
      { invoiceNumber: "008/2026", rides: [rides[2]] }
    ]);
  });

  it("ignores missing and invalid invoice numbers when grouping", () => {
    const rides = [
      { id: "a", invoiceNumber: null },
      { id: "b" },
      { id: "c", invoiceNumber: "1000/2026" },
      { id: "d", invoiceNumber: "001/2026" }
    ];

    expect(groupRidesByInvoice(rides)).toEqual([
      { invoiceNumber: "001/2026", rides: [rides[3]] }
    ]);
  });

  it("returns rides without a usable invoice number as unlinked", () => {
    const rides = [
      { id: "a", invoiceNumber: null },
      { id: "b" },
      { id: "c", invoiceNumber: "1000/2026" },
      { id: "d", invoiceNumber: "001/2026" }
    ];

    expect(getUnlinkedRides(rides)).toEqual([rides[0], rides[1], rides[2]]);
  });
});
