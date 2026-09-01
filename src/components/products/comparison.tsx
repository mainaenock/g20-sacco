"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import type { Product } from "@/types";
import { Badge, DemoNotice } from "@/components/ui/primitives";

export function Comparison({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState(products.slice(0, Math.min(2, products.length)).map((item) => item.id));
  const chosen = products.filter((item) => selected.includes(item.id));

  function toggle(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : current.length < 4 ? [...current, id] : current);
  }

  return (
    <>
      <DemoNotice />
      <div className="filters"><span className="field-label">Choose 2-4 demonstration products</span><div className="filter-row">{products.map((product) => <button type="button" key={product.id} className="filter-chip" aria-pressed={selected.includes(product.id)} onClick={() => toggle(product.id)}>{product.name}</button>)}</div></div>
      <div className="mobile-comparison" aria-live="polite">
        {chosen.map((product) => <article key={product.id} className="comparison-card"><div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}><h2 style={{ fontSize: "1.35rem" }}>{product.name}</h2><Badge tone="warning">Demo</Badge></div><p>{product.summary}</p><dl><div><dt>Type</dt><dd>{product.kind}</dd></div><div><dt>Rate context</dt><dd>{product.rate ? `${product.rate.value}${product.rate.unit}, ${product.rate.method}` : "Configured later"}</dd></div><div><dt>Audience</dt><dd>{product.audience.join(", ")}</dd></div><div><dt>Availability</dt><dd>{product.availability}</dd></div></dl><h3>Key features</h3>{product.benefits.map((benefit) => <p key={benefit}><CheckCircle2 size={16} color="var(--success)" style={{ verticalAlign: "middle", marginRight: 6 }} />{benefit}</p>)}</article>)}
      </div>
      <p className="help-text" style={{ marginTop: 18 }}>This comparison highlights differences; it does not declare a “best” product or make a recommendation.</p>
    </>
  );
}
