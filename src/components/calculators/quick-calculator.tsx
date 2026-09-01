"use client";

import { useMemo, useState } from "react";
import { calculateLoan } from "@/lib/calculators";
import { formatKES } from "@/lib/format";
import { ButtonLink } from "@/components/ui/primitives";

export function QuickCalculator() {
  const [principal, setPrincipal] = useState(250000);
  const [months, setMonths] = useState(24);
  const result = useMemo(() => calculateLoan({ principal, annualRate: 12, months, method: "reducing" }), [principal, months]);

  return (
    <div className="quick-calc">
      <div>
        <p className="eyebrow">Quick repayment preview</p>
        <h2>Turn a figure into a clearer monthly picture.</h2>
        <p className="quick-calc__intro">Use a demonstration 12% p.a. reducing-balance rule, then open the full calculator to adjust every assumption.</p>
        <div className="quick-calc__form">
          <div className="field">
            <label htmlFor="quick-amount">Amount</label>
            <div className="input-prefix"><span>KSh</span><input id="quick-amount" className="input" type="number" inputMode="decimal" min="1000" step="1000" value={principal} onChange={(event) => setPrincipal(Number(event.target.value))} /></div>
          </div>
          <div className="field">
            <label htmlFor="quick-term">Term</label>
            <select id="quick-term" className="select" value={months} onChange={(event) => setMonths(Number(event.target.value))}>
              <option value="6">6 months</option><option value="12">12 months</option><option value="24">24 months</option><option value="36">36 months</option><option value="48">48 months</option>
            </select>
          </div>
        </div>
      </div>
      <div className="quick-result" aria-live="polite">
        <small>Estimated monthly repayment</small>
        <strong>{formatKES(result.monthlyPayment)}</strong>
        <p>Estimated total interest: {formatKES(result.totalInterest)}</p>
        <p className="quick-result__note">Preliminary illustration only. It is not a quote, offer or approval.</p>
        <ButtonLink href="/calculators/loan-repayment" variant="gold">Open full calculator</ButtonLink>
      </div>
    </div>
  );
}
