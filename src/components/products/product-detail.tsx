import Link from "next/link";
import { CheckCircle2, FileText, HelpCircle, Scale, ShieldCheck } from "lucide-react";
import { Badge, ButtonLink, DemoNotice } from "@/components/ui/primitives";
import type { Product } from "@/types";

export function ProductDetail({ product }: { product: Product }) {
  return (
    <>
      <DemoNotice />
      <div className="fact-grid" aria-label="Product facts">
        {product.facts.map((fact) => <div className="fact" key={fact.label}><small>{fact.label}</small><strong>{fact.value}</strong></div>)}
      </div>
      <div className="detail-grid" style={{ marginTop: 28 }}>
        <div>
          <section className="detail-section"><p className="eyebrow">Who it is for</p><h2>A clear fit starts with context.</h2><p>{product.summary}</p><div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>{product.audience.map((audience) => <Badge key={audience} tone="info">{audience}</Badge>)}</div></section>
          <section className="detail-section"><p className="eyebrow">Benefits</p><h2>What this option is designed to help with</h2><ul>{product.benefits.map((item) => <li key={item}><CheckCircle2 size={17} style={{ color: "var(--success)", verticalAlign: "middle", marginRight: 8 }} />{item}</li>)}</ul></section>
          <section className="detail-section"><p className="eyebrow">Requirements</p><h2>What to prepare</h2><ul>{product.requirements.map((item) => <li key={item}><FileText size={17} style={{ color: "var(--brand)", verticalAlign: "middle", marginRight: 8 }} />{item}</li>)}</ul></section>
          <section className="detail-section"><p className="eyebrow">Important context</p><h2>Rates, fees and decisions</h2><p>{product.disclaimer}</p><p>Any rate must be displayed with its calculation method, effective date and approved conditions. A calculator result is an estimate; an official decision comes only after the configured review process.</p></section>
          <section className="detail-section"><p className="eyebrow">Frequently asked</p><h2>Questions people ask first</h2><details><summary>Does this page confirm I qualify?</summary><p>No. It helps you understand a demonstration product. Eligibility and approval require official configured criteria and review.</p></details><details><summary>Are these current G20 rates?</summary><p>No. The values are clearly marked demonstration data and must be replaced with approved effective-dated content.</p></details></section>
        </div>
        <aside className="detail-sidebar">
          <div className="calculator-panel">
            <ShieldCheck color="var(--brand)" /><h2 style={{ marginTop: 16 }}>Your next useful step</h2><p style={{ color: "var(--muted)" }}>Run an estimate, compare options or ask for guided help. None of these actions implies approval.</p>
            <div style={{ display: "grid", gap: 9 }}>
              <ButtonLink href={product.kind === "loan" ? "/calculators/loan-repayment" : "/calculators/savings-goal"}>Calculate an estimate</ButtonLink>
              <ButtonLink href="/compare" variant="secondary">Compare products</ButtonLink>
              <ButtonLink href="/ask-g20" variant="ghost">Ask G20</ButtonLink>
            </div>
          </div>
          <div className="trust-card" style={{ marginTop: 16 }}><Scale color="var(--brand)" /><h3 style={{ marginTop: 16 }}>Effective-date ready</h3><p>{product.effectiveDate}</p><Link className="product-card__link" href="/transparency">How product information is governed →</Link></div>
          <div className="trust-card" style={{ marginTop: 16 }}><HelpCircle color="var(--brand)" /><h3 style={{ marginTop: 16 }}>Need human help?</h3><p>Request a callback or visit the help centre.</p><Link className="product-card__link" href="/request-callback">Request callback →</Link></div>
        </aside>
      </div>
    </>
  );
}
