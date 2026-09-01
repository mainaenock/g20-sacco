import { describe, expect, it } from "vitest";
import { calculateEligibility, calculateFixedDeposit, calculateLoan, calculateSavingsGoal } from "./calculators";

describe("financial calculators", () => {
  it("calculates a zero-interest loan deterministically", () => {
    const result = calculateLoan({ principal: 120000, annualRate: 0, months: 12, method: "reducing" });
    expect(result.monthlyPayment).toBe(10000);
    expect(result.totalInterest).toBe(0);
    expect(result.schedule).toHaveLength(12);
  });
  it("keeps flat and reducing methods distinct", () => {
    const flat = calculateLoan({ principal: 200000, annualRate: 12, months: 24, method: "flat" });
    const reducing = calculateLoan({ principal: 200000, annualRate: 12, months: 24, method: "reducing" });
    expect(flat.totalInterest).toBeGreaterThan(reducing.totalInterest);
  });
  it("identifies the constraining eligibility rule", () => {
    expect(calculateEligibility(100000, 3, 250000, 500000)).toEqual({ estimate: 250000, constrainedBy: "Income cap" });
  });
  it("computes savings and fixed-deposit results", () => {
    expect(calculateSavingsGoal({ target: 120000, current: 0, months: 12, annualRate: 0 }).monthlyContribution).toBe(10000);
    expect(calculateFixedDeposit(100000, 10, 12)).toEqual({ interest: 10000, maturity: 110000 });
  });
});
