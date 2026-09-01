import { describe, expect, it } from "vitest";
import { formatKES, normalizeKenyanPhone } from "./format";

describe("Kenyan formatting", () => {
  it("formats currency as KES", () => { expect(formatKES(125000)).toMatch(/KES|Ksh/i); });
  it("normalizes common Kenyan mobile formats", () => {
    expect(normalizeKenyanPhone("0712 345 678")).toBe("+254712345678");
    expect(normalizeKenyanPhone("+254 112 345 678")).toBe("+254112345678");
    expect(normalizeKenyanPhone("712345678")).toBe("+254712345678");
  });
  it("rejects invalid values", () => { expect(normalizeKenyanPhone("12345")).toBeNull(); });
});
