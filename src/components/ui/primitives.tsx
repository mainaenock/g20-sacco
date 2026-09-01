import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, CircleAlert, LoaderCircle } from "lucide-react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`container ${className}`}>{children}</div>;
}

export function ButtonLink({ href, children, variant = "primary", className = "" }: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "gold";
  className?: string;
}) {
  return <Link href={href} className={`button button--${variant} ${className}`}>{children}<ArrowRight size={17} aria-hidden="true" /></Link>;
}

export function SectionHeader({ eyebrow, title, description, action }: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="section-header">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {description && <p className="section-header__description">{description}</p>}
      </div>
      {action && <div className="section-header__action">{action}</div>}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "success" | "warning" | "danger" | "info" }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}

export function DemoNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`demo-notice ${compact ? "demo-notice--compact" : ""}`} role="note">
      <CircleAlert size={18} aria-hidden="true" />
      <span><strong>Demonstration data.</strong> Product names, rates, fees, branches and application records shown here are illustrative, not official G20 information.</span>
    </div>
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return <div className="state-card" role="status"><LoaderCircle className="spin" aria-hidden="true" /><p>{label}…</p></div>;
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return <div className="state-card"><h3>{title}</h3><p>{body}</p></div>;
}
