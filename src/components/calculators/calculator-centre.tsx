import Link from "next/link";
import { ArrowRight, BadgePercent, ChartNoAxesCombined, CircleDollarSign, Goal, Landmark, PiggyBank, Scale, WalletCards } from "lucide-react";
import { DemoNotice } from "@/components/ui/primitives";

export const calculatorDefinitions = [
  { slug: "loan-repayment", title: "Loan repayment", description: "Estimate monthly payments, interest and total cost by method.", icon: Landmark },
  { slug: "loan-affordability", title: "Loan affordability", description: "Explore a preliminary payment range from disposable income.", icon: WalletCards },
  { slug: "loan-eligibility", title: "Loan eligibility", description: "See which configured mock rule constrains an estimate.", icon: Scale },
  { slug: "deposit-multiplier", title: "Deposit multiplier", description: "Apply a configured multiplier without implying eligibility.", icon: ChartNoAxesCombined },
  { slug: "savings-goal", title: "Savings goal", description: "Plan the periodic contribution needed for a target.", icon: Goal },
  { slug: "regular-savings", title: "Regular savings", description: "Project a regular monthly saving habit.", icon: PiggyBank },
  { slug: "fixed-deposit", title: "Fixed deposit", description: "Estimate maturity value from entered assumptions.", icon: CircleDollarSign },
  { slug: "dividend-estimator", title: "Dividend estimator", description: "Estimate only from a rate you explicitly enter.", icon: BadgePercent },
  { slug: "loan-comparison", title: "Loan comparison", description: "Compare method, term and total cost side by side.", icon: Scale },
] as const;

export function CalculatorCentre() {
  return (
    <>
      <DemoNotice />
      <div className="card-grid card-grid--three">
        {calculatorDefinitions.map(({ slug, title, description, icon: Icon }) => <Link href={`/calculators/${slug}`} key={slug} className="product-card"><div className="product-card__top"><span className="product-card__icon"><Icon /></span><span className="badge badge--info">Deterministic</span></div><h2 style={{ fontSize: "1.35rem" }}>{title}</h2><p>{description}</p><span className="product-card__link">Open calculator <ArrowRight size={17} /></span></Link>)}
      </div>
    </>
  );
}
