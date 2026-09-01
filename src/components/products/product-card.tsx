import Link from "next/link";
import { ArrowRight, Landmark, PiggyBank } from "lucide-react";
import { Badge } from "@/components/ui/primitives";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const href = product.kind === "loan" ? `/borrow/${product.slug}` : `/save/${product.slug}`;
  return (
    <article className="product-card">
      <div className="product-card__top">
        <span className="product-card__icon">{product.kind === "loan" ? <Landmark aria-hidden="true" /> : <PiggyBank aria-hidden="true" />}</span>
        <Badge tone="warning">Demo</Badge>
      </div>
      <p className="eyebrow">{product.eyebrow}</p>
      <h3>{product.name}</h3>
      <p>{product.summary}</p>
      <div className="product-card__meta">
        <span>{product.audience.slice(0, 2).join(" · ")}</span>
        <span>{product.effectiveDate}</span>
      </div>
      <Link href={href} className="product-card__link">Explore details <ArrowRight size={17} aria-hidden="true" /></Link>
    </article>
  );
}
