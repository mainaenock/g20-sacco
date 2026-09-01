export type InterestMethod = "reducing" | "flat";

export interface LoanInput {
  principal: number;
  annualRate: number;
  months: number;
  method: InterestMethod;
  fees?: number;
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  schedule: { month: number; payment: number; interest: number; principal: number; balance: number }[];
}

export function calculateLoan(input: LoanInput): LoanResult {
  const principal = Math.max(0, input.principal);
  const months = Math.max(1, Math.round(input.months));
  const annualRate = Math.max(0, input.annualRate) / 100;
  const fees = Math.max(0, input.fees ?? 0);
  let monthlyPayment = 0;

  if (input.method === "flat") {
    const interest = principal * annualRate * (months / 12);
    monthlyPayment = (principal + interest) / months;
  } else {
    const monthlyRate = annualRate / 12;
    monthlyPayment = monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate * (1 + monthlyRate) ** months) / ((1 + monthlyRate) ** months - 1);
  }

  const schedule: LoanResult["schedule"] = [];
  let balance = principal;
  const flatMonthlyInterest = principal * annualRate * (months / 12) / months;
  for (let month = 1; month <= months; month += 1) {
    const interest = input.method === "flat" ? flatMonthlyInterest : balance * (annualRate / 12);
    const principalPart = Math.min(balance, monthlyPayment - interest);
    balance = Math.max(0, balance - principalPart);
    schedule.push({ month, payment: monthlyPayment, interest, principal: principalPart, balance });
  }

  const totalRepayment = monthlyPayment * months;
  return {
    monthlyPayment,
    totalInterest: Math.max(0, totalRepayment - principal),
    totalCost: totalRepayment + fees,
    schedule,
  };
}

export interface SavingsGoalInput {
  target: number;
  current: number;
  months: number;
  annualRate: number;
}

export function calculateSavingsGoal(input: SavingsGoalInput) {
  const target = Math.max(0, input.target);
  const current = Math.max(0, input.current);
  const months = Math.max(1, Math.round(input.months));
  const monthlyRate = Math.max(0, input.annualRate) / 100 / 12;
  const futureCurrent = current * (1 + monthlyRate) ** months;
  const remaining = Math.max(0, target - futureCurrent);
  const contribution = monthlyRate === 0
    ? remaining / months
    : remaining * monthlyRate / ((1 + monthlyRate) ** months - 1);
  return { monthlyContribution: contribution, projectedTarget: target, growthFromCurrent: futureCurrent - current };
}

export function calculateFixedDeposit(principal: number, annualRate: number, months: number) {
  const p = Math.max(0, principal);
  const years = Math.max(1, months) / 12;
  const interest = p * Math.max(0, annualRate) / 100 * years;
  return { interest, maturity: p + interest };
}

export function calculateEligibility(deposits: number, multiplier: number, incomeCap: number, productMax: number) {
  const depositLimit = Math.max(0, deposits) * Math.max(0, multiplier);
  const limits = [
    { rule: "Deposit multiplier", value: depositLimit },
    { rule: "Income cap", value: Math.max(0, incomeCap) },
    { rule: "Product maximum", value: Math.max(0, productMax) },
  ];
  const constraint = limits.reduce((lowest, current) => current.value < lowest.value ? current : lowest);
  return { estimate: constraint.value, constrainedBy: constraint.rule };
}
