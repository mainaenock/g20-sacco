"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Accessibility, Clock, Map, MapPin, Search } from "lucide-react";
import { branches } from "@/mocks/fixtures";
import { Badge, DemoNotice, EmptyState } from "@/components/ui/primitives";

export function BranchLocator() {
  const [query, setQuery] = useState("");
  const [service, setService] = useState("All services");
  const services = useMemo(() => ["All services", ...new Set(branches.flatMap((branch) => branch.services))], []);
  const matches = branches.filter((branch) => `${branch.name} ${branch.county} ${branch.address}`.toLowerCase().includes(query.toLowerCase()) && (service === "All services" || branch.services.includes(service)));
  return <><DemoNotice /><div className="filters"><div className="field"><label htmlFor="branch-search"><Search size={15} /> Search town, county or branch</label><input id="branch-search" className="input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search verified branch details" /></div><div className="filter-row">{services.map((item) => <button type="button" key={item} className="filter-chip" aria-pressed={service === item} onClick={() => setService(item)}>{item}</button>)}</div></div><div className="branch-layout"><div className="branch-list">{matches.length ? matches.map((branch) => <article className="branch-card" key={branch.id}><div className="branch-card__top"><div><Badge tone="warning">Demo location</Badge><h2 style={{ fontSize: "1.35rem", marginTop: 14 }}>{branch.name}</h2></div><MapPin color="var(--brand)" /></div><p>{branch.address}</p><p><Clock size={15} style={{ verticalAlign: "middle" }} /> {branch.hours}</p><p><Accessibility size={15} style={{ verticalAlign: "middle" }} /> {branch.accessibility}</p><div className="branch-card__services">{branch.services.map((item) => <Badge key={item}>{item}</Badge>)}</div><Link className="product-card__link" href={`/branches/${branch.slug}`}>View service point →</Link></article>) : <EmptyState title="No service points match" body="Clear the filter or try a broader search." />}</div><div className="map-placeholder"><div><Map size={42} /><h2 style={{ fontSize: "1.4rem", marginTop: 14 }}>Map-ready, list-complete</h2><p>A map provider and verified coordinates are not configured. The full accessible list remains usable.</p></div></div></div></>;
}
