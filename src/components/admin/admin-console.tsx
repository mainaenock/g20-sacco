"use client";

import { useState } from "react";
import { Activity, BadgeDollarSign, BellRing, Bot, Boxes, Briefcase, FileText, LayoutDashboard, MapPin, Plus, Settings, ShieldCheck, Users } from "lucide-react";

const modules = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "content", label: "Content", icon: FileText },
  { id: "products", label: "Products & rates", icon: Boxes },
  { id: "applications", label: "Applications", icon: Users },
  { id: "payments", label: "Payments", icon: BadgeDollarSign },
  { id: "support", label: "Support", icon: Briefcase },
  { id: "ai", label: "AI knowledge", icon: Bot },
  { id: "branches", label: "Branches", icon: MapPin },
  { id: "settings", label: "Settings", icon: Settings },
];

const rows: Record<string, { id: string; title: string; status: string; detail: string }[]> = {
  dashboard: [{ id: "DEMO-APP-104", title: "Application queue", status: "Under review", detail: "7 demo records" }, { id: "DEMO-PAY-208", title: "Payment reconciliation", status: "Attention", detail: "2 pending confirmations" }, { id: "DEMO-AI-021", title: "Unanswered help topics", status: "Review", detail: "4 anonymized intents" }],
  content: [{ id: "PAGE-012", title: "Membership requirements", status: "Published", detail: "Updated 2 days ago" }, { id: "GUIDE-028", title: "Understand loan cost", status: "Draft", detail: "Awaiting review" }],
  products: [{ id: "PROD-DEMO-01", title: "Demo Flex Loan", status: "Preview", detail: "Future rate version staged" }, { id: "RATE-DEMO-03", title: "Demo Goal Savings", status: "Current demo", detail: "Historical versions visible" }],
  applications: [{ id: "DEMO-G20-8A4F2C", title: "Individual application", status: "Under review", detail: "Payment confirmed" }, { id: "DEMO-G20-173BA2", title: "Group application", status: "Changes required", detail: "Document re-upload requested" }],
  payments: [{ id: "PAY-DEMO-481", title: "Registration payment", status: "Confirmation pending", detail: "Reconciliation required" }, { id: "PAY-DEMO-482", title: "Registration payment", status: "Paid", detail: "Receipt recorded" }],
  support: [{ id: "COMP-DEMO-88", title: "Service complaint", status: "Assigned", detail: "Response due in demo SLA" }, { id: "CALL-DEMO-12", title: "Callback request", status: "Open", detail: "Membership topic" }],
  ai: [{ id: "SRC-DEMO-11", title: "Membership requirements", status: "Indexed", detail: "Approved source" }, { id: "SRC-DEMO-14", title: "Payment help", status: "Needs review", detail: "Source coverage gap" }],
  branches: [{ id: "BR-DEMO-01", title: "Demo Central Service Point", status: "Draft", detail: "Address verification required" }],
  settings: [{ id: "SET-CONTACT", title: "Official contact channels", status: "Incomplete", detail: "Launch blocker" }, { id: "SET-PAYMENT", title: "Official payment details", status: "Incomplete", detail: "Launch blocker" }],
};

export function AdminConsole({ initial = "dashboard" }: { initial?: string }) {
  const [active, setActive] = useState(modules.some((item) => item.id === initial) ? initial : "dashboard");
  const current = modules.find((item) => item.id === active) ?? modules[0];
  return <div className="admin-shell"><aside className="admin-nav"><div className="admin-nav__head"><strong>G20 Website Admin</strong><span className="badge badge--warning">Demo</span></div><div className="admin-nav__links">{modules.map(({ id, label, icon: Icon }) => <button type="button" key={id} aria-pressed={active === id} onClick={() => setActive(id)}><Icon size={16} style={{ verticalAlign: "middle", marginRight: 8 }} />{label}</button>)}</div></aside><section className="admin-main"><div className="admin-toolbar"><div><p className="eyebrow">Role: Admin fixture</p><h2>{current.label}</h2></div><button className="button button--primary" type="button"><Plus /> Create demo item</button></div><div className="alert alert--warning"><ShieldCheck />This frontend reflects role-aware visibility only. A production backend must enforce every permission and audit mutation.</div>{active === "dashboard" && <div className="kpi-grid"><div className="kpi"><small>Applications</small><strong>24</strong><span>Demo aggregate</span></div><div className="kpi"><small>Pending payment checks</small><strong>2</strong><span>Needs review</span></div><div className="kpi"><small>Content drafts</small><strong>8</strong><span>Across modules</span></div><div className="kpi"><small>AI source coverage</small><strong>82%</strong><span>Anonymized demo</span></div></div>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Item</th><th>ID</th><th>Status</th><th>Detail</th></tr></thead><tbody>{(rows[active] ?? rows.dashboard).map((row) => <tr key={row.id}><td><strong>{row.title}</strong></td><td>{row.id}</td><td><span className={`badge ${row.status.toLowerCase().includes("paid") || row.status === "Published" || row.status === "Indexed" ? "badge--success" : row.status.includes("Attention") || row.status.includes("required") || row.status.includes("Incomplete") ? "badge--danger" : "badge--warning"}`}>{row.status}</span></td><td>{row.detail}</td></tr>)}</tbody></table></div><div className="card-grid card-grid--three" style={{ marginTop: 20 }}><div className="feature-card"><Activity color="var(--brand)" /><h3 style={{ marginTop: 18 }}>Audit ready</h3><p>Publishing, status and rate-version changes include an audit-timeline UI.</p></div><div className="feature-card"><BellRing color="var(--brand)" /><h3 style={{ marginTop: 18 }}>Operational states</h3><p>Pending, partial, overpaid, failed and reconciliation views remain distinct.</p></div><div className="feature-card"><ShieldCheck color="var(--brand)" /><h3 style={{ marginTop: 18 }}>Sensitive by default</h3><p>Demo records resemble no real member and expose no identity-document content.</p></div></div></section></div>;
}
