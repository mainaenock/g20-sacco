import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/primitives";
import { routeLabels } from "@/lib/site-config";

export function PageHero({ path, eyebrow, title, description }: { path: string[]; eyebrow: string; title: string; description: string }) {
  const crumbs = path.map((segment, index) => ({ label: routeLabels[segment] ?? segment.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" "), href: `/${path.slice(0, index + 1).join("/")}` }));
  return <section className="page-hero"><Container><nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link>{crumbs.map((crumb, index) => <span key={crumb.href} style={{ display: "contents" }}><ChevronRight size={13} />{index === crumbs.length - 1 ? <span aria-current="page">{crumb.label}</span> : <Link href={crumb.href}>{crumb.label}</Link>}</span>)}</nav><div className="page-hero__inner"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="page-hero__lead">{description}</p></div></Container></section>;
}
