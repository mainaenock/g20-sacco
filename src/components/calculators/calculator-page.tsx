"use client";

import { useMemo, useState } from "react";
import { Calculator, Info, Printer } from "lucide-react";
import { calculateEligibility, calculateFixedDeposit, calculateLoan, calculateSavingsGoal, type InterestMethod } from "@/lib/calculators";
import { formatKES } from "@/lib/format";
import { DemoNotice } from "@/components/ui/primitives";
import { track } from "@/lib/analytics";

type CalculatorSlug = "loan-repayment" | "loan-affordability" | "loan-eligibility" | "deposit-multiplier" | "savings-goal" | "regular-savings" | "fixed-deposit" | "dividend-estimator" | "loan-comparison";

const titles: Record<CalculatorSlug, string> = {
  "loan-repayment": "Loan repayment estimate",
  "loan-affordability": "Loan affordability estimate",
  "loan-eligibility": "Loan eligibility estimate",
  "deposit-multiplier": "Deposit multiplier estimate",
  "savings-goal": "Savings goal planner",
  "regular-savings": "Regular savings projection",
  "fixed-deposit": "Fixed deposit estimate",
  "dividend-estimator": "Dividend / rebate estimate",
  "loan-comparison": "Loan comparison estimate",
};

function MoneyField({ id, label, value, onChange, help }: { id: string; label: string; value: number; onChange: (value: number) => void; help?: string }) {
  return <div className="field"><label htmlFor={id}>{label}</label><div className="input-prefix"><span>KSh</span><input id={id} className="input" type="number" inputMode="decimal" min="0" step="1000" value={value} onFocus={() => track("calculator_started", { calculator: id })} onChange={(event) => onChange(Number(event.target.value))} /></div>{help && <small>{help}</small>}</div>;
}

function NumberField({ id, label, value, onChange, suffix, min = 0 }: { id: string; label: string; value: number; onChange: (value: number) => void; suffix?: string; min?: number }) {
  return <div className="field"><label htmlFor={id}>{label}</label><div className="input-prefix"><input id={id} className="input" type="number" inputMode="decimal" min={min} value={value} onChange={(event) => onChange(Number(event.target.value))} />{suffix && <span style={{ padding: "0 14px 0 0" }}>{suffix}</span>}</div></div>;
}

export function CalculatorPage({ slug }: { slug: CalculatorSlug }) {
  const [amount, setAmount] = useState(250000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(24);
  const [method, setMethod] = useState<InterestMethod>("reducing");
  const [current, setCurrent] = useState(50000);
  const [monthly, setMonthly] = useState(10000);
  const [income, setIncome] = useState(70000);
  const [expenses, setExpenses] = useState(40000);
  const [multiplier, setMultiplier] = useState(3);

  const loan = useMemo(() => calculateLoan({ principal: amount, annualRate: rate, months, method }), [amount, rate, months, method]);
  const flatLoan = useMemo(() => calculateLoan({ principal: amount, annualRate: rate, months, method: "flat" }), [amount, rate, months]);
  const savingsGoal = useMemo(() => calculateSavingsGoal({ target: amount, current, months, annualRate: rate }), [amount, current, months, rate]);
  const fixed = useMemo(() => calculateFixedDeposit(amount, rate, months), [amount, rate, months]);
  const eligibility = useMemo(() => calculateEligibility(current, multiplier, Math.max(0, (income - expenses) * months * .45), amount), [current, multiplier, income, expenses, months, amount]);
  const regularProjection = useMemo(() => {
    const monthlyRate = rate / 100 / 12;
    const projected = current * (1 + monthlyRate) ** months + monthly * (((1 + monthlyRate) ** months - 1) / (monthlyRate || 1));
    return { projected: monthlyRate === 0 ? current + monthly * months : projected, contributions: current + monthly * months };
  }, [current, monthly, months, rate]);

  const result = (() => {
    switch (slug) {
      case "loan-affordability": return { primary: formatKES(Math.max(0, (income - expenses) * .35)), label: "Preliminary monthly repayment range", rows: [["Disposable income", formatKES(income - expenses)], ["Planning share used", "35% (demo)"]] };
      case "loan-eligibility": return { primary: formatKES(eligibility.estimate), label: "Preliminary estimate", rows: [["Constraining rule", eligibility.constrainedBy], ["Deposit-based limit", formatKES(current * multiplier)]] };
      case "deposit-multiplier": return { primary: formatKES(current * multiplier), label: "Deposit-multiplier result", rows: [["Deposits entered", formatKES(current)], ["Mock multiplier", `${multiplier}×`]] };
      case "savings-goal": return { primary: formatKES(savingsGoal.monthlyContribution), label: "Estimated monthly contribution", rows: [["Target", formatKES(amount)], ["Current amount", formatKES(current)], ["Planning horizon", `${months} months`]] };
      case "regular-savings": return { primary: formatKES(regularProjection.projected), label: "Projected balance", rows: [["Contributions", formatKES(regularProjection.contributions)], ["Estimated growth", formatKES(regularProjection.projected - regularProjection.contributions)]] };
      case "fixed-deposit": return { primary: formatKES(fixed.maturity), label: "Estimated maturity value", rows: [["Principal", formatKES(amount)], ["Estimated interest", formatKES(fixed.interest)]] };
      case "dividend-estimator": return { primary: formatKES(amount * rate / 100), label: "Estimated amount", rows: [["Entered base", formatKES(amount)], ["Rate you entered", `${rate}%`]] };
      case "loan-comparison": return { primary: formatKES(loan.monthlyPayment), label: "Reducing-balance monthly estimate", rows: [["Reducing total cost", formatKES(loan.totalCost)], ["Flat-method monthly", formatKES(flatLoan.monthlyPayment)], ["Flat total cost", formatKES(flatLoan.totalCost)]] };
      default: return { primary: formatKES(loan.monthlyPayment), label: "Estimated monthly repayment", rows: [["Total interest", formatKES(loan.totalInterest)], ["Total repayment", formatKES(loan.totalCost)], ["Method", method === "reducing" ? "Reducing balance" : "Flat method"]] };
    }
  })();

  const isLoan = ["loan-repayment", "loan-comparison"].includes(slug);
  const isIncome = slug === "loan-affordability" || slug === "loan-eligibility";
  const isSavings = ["savings-goal", "regular-savings"].includes(slug);

  return (
    <>
      <DemoNotice />
      <div className="calculator-layout">
        <section className="calculator-panel">
          <h2>{titles[slug]}</h2>
          <div className="form-grid">
            {isIncome ? <><MoneyField id="monthly-income" label="Monthly income assumption" value={income} onChange={setIncome} /><MoneyField id="monthly-expenses" label="Monthly commitments and expenses" value={expenses} onChange={setExpenses} /></> : <MoneyField id="calculator-amount" label={isSavings ? "Savings target" : slug === "deposit-multiplier" ? "Configured product maximum" : "Amount"} value={amount} onChange={setAmount} />}
            {["loan-eligibility", "deposit-multiplier", "savings-goal", "regular-savings"].includes(slug) && <MoneyField id="current-amount" label={slug.includes("loan") || slug.includes("multiplier") ? "Qualifying deposits" : "Current savings"} value={current} onChange={setCurrent} />}
            {slug === "regular-savings" && <MoneyField id="monthly-saving" label="Monthly contribution" value={monthly} onChange={setMonthly} />}
            {slug === "loan-eligibility" || slug === "deposit-multiplier" ? <NumberField id="multiplier" label="Configured multiplier" value={multiplier} onChange={setMultiplier} suffix="×" min={1} /> : null}
            {!["deposit-multiplier", "loan-eligibility", "loan-affordability"].includes(slug) && <NumberField id="annual-rate" label="Annual rate assumption" value={rate} onChange={setRate} suffix="%" />}
            {!["dividend-estimator", "deposit-multiplier"].includes(slug) && <div className="field"><label htmlFor="term-months">Planning term</label><select id="term-months" className="select" value={months} onChange={(event) => setMonths(Number(event.target.value))}><option value="6">6 months</option><option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option><option value="48">48 months</option><option value="60">60 months</option></select></div>}
            {isLoan && slug !== "loan-comparison" && <div className="field"><span className="field-label">Interest method</span><div className="segmented"><button type="button" aria-pressed={method === "reducing"} onClick={() => setMethod("reducing")}>Reducing balance</button><button type="button" aria-pressed={method === "flat"} onClick={() => setMethod("flat")}>Flat method</button></div></div>}
          </div>
        </section>
        <aside className="result-panel" aria-live="polite">
          <div className="result-hero"><small>{result.label}</small><strong>{result.primary}</strong></div>
          <div className="result-list">{result.rows.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div>
          <div className="assumptions"><Info size={17} style={{ verticalAlign: "middle", marginRight: 7 }} />Preliminary illustration only. It does not confirm eligibility, approval, entitlement or an official G20 offer. Replace all demo rules with approved, effective-dated configuration.</div>
          <button className="button button--gold" style={{ width: "100%", marginTop: 16 }} type="button" onClick={() => { track("calculator_completed", { calculator: slug }); window.print(); }}><Printer size={17} /> Print summary</button>
          {isLoan && <div className="schedule"><h2 style={{ color: "white", fontSize: "1.2rem" }}><Calculator size={18} /> Repayment preview</h2><table><thead><tr><th>Month</th><th>Payment</th><th>Interest</th><th>Balance</th></tr></thead><tbody>{loan.schedule.slice(0, 6).map((row) => <tr key={row.month}><td>{row.month}</td><td>{formatKES(row.payment)}</td><td>{formatKES(row.interest)}</td><td>{formatKES(row.balance)}</td></tr>)}</tbody></table><small>First 6 months shown.</small></div>}
        </aside>
      </div>
    </>
  );
}
