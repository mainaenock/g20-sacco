"use client";

import { useEffect, useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { ProductCard } from "@/components/products/product-card";
import { DemoNotice, EmptyState, LoadingState } from "@/components/ui/primitives";
import { productService } from "@/lib/services";
import type { Product, ProductKind } from "@/types";

export function ProductHub({ kind }: { kind: ProductKind }) {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState("All goals");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    productService.list({ kind }).then((results) => { if (active) { setItems(results); setLoading(false); } });
    return () => { active = false; };
  }, [kind]);

  const goals = useMemo(() => ["All goals", ...new Set(items.flatMap((item) => item.goals))], [items]);
  const filtered = items.filter((item) => (goal === "All goals" || item.goals.includes(goal)) && `${item.name} ${item.summary}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <DemoNotice />
      <div className="filters" aria-label={`${kind} product filters`}>
        <div className="field"><label htmlFor="product-search"><Search size={15} /> Search products</label><input id="product-search" className="input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${kind === "loan" ? "loans" : "savings"}`} /></div>
        <div><span className="field-label"><Filter size={15} /> Filter by goal</span><div className="filter-row" style={{ marginTop: 8 }}>{goals.map((item) => <button key={item} className="filter-chip" type="button" aria-pressed={goal === item} onClick={() => setGoal(item)}>{item}</button>)}</div></div>
      </div>
      {loading ? <LoadingState label="Loading demonstration products" /> : filtered.length ? <div className="card-grid card-grid--three">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState title="No matching products" body="Try another goal or clear your search." />}
    </>
  );
}
