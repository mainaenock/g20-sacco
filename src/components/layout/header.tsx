"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Sparkles, X, Zap, MapPin, ShieldCheck } from "lucide-react";
import { Brand } from "@/components/ui/brand";
import { primaryNav } from "@/lib/site-config";

const searchLinks = [
  { title: "Join G20", text: "Start a demonstration membership application", href: "/join" },
  { title: "Loan calculators", text: "Estimate repayments using deterministic rules", href: "/calculators/loan-repayment" },
  { title: "Savings calculators", text: "Plan a goal or fixed deposit scenario", href: "/calculators/savings-goal" },
  { title: "Application status", text: "Verify a demo application reference", href: "/application-status" },
  { title: "Security centre", text: "Protect your PIN, OTP and identity", href: "/security" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [lite, setLite] = useState(false);
  const searchResultsId = useId();

  useEffect(() => {
    const stored = window.localStorage.getItem("g20-lite-mode") === "true";
    // Reading the external preference after hydration intentionally synchronizes client state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLite(stored);
    document.documentElement.dataset.lite = String(stored);
  }, []);

  useEffect(() => {
    // Route changes close transient navigation surfaces.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  function toggleLite() {
    const next = !lite;
    setLite(next);
    window.localStorage.setItem("g20-lite-mode", String(next));
    document.documentElement.dataset.lite = String(next);
  }

  const results = searchLinks.filter((item) => `${item.title} ${item.text}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="utility-bar">
        <div className="container utility-bar__inner">
          <span className="utility-bar__status"><span className="status-dot" /><span className="utility-status-label">Demo services available</span></span>
          <nav aria-label="Utility navigation">
            <Link href="/branches"><MapPin size={14} /> Branches</Link>
            <Link href="/security"><ShieldCheck size={14} /> Security</Link>
            <button type="button" className="utility-button" onClick={toggleLite} aria-pressed={lite}>
              <Zap size={14} /><span className="lite-label">Lite mode</span> {lite ? "on" : "off"}
            </button>
            <button type="button" className="utility-button" aria-label="Language selection: English">EN</button>
          </nav>
        </div>
      </div>
      <header className="site-header">
        <div className="container site-header__inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Primary navigation">
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href} aria-current={pathname.startsWith(item.href) ? "page" : undefined}>{item.label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <Link href="/join" className="button button--primary header-join">Join G20</Link>
            <button type="button" className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Open navigation">
              <Menu size={23} />
            </button>
          </div>
        </div>
        <div className="header-search-row">
          <div className="container">
            <div
              className="header-search-shell"
              onFocusCapture={() => setSearchOpen(true)}
              onBlurCapture={(event) => {
                const next = event.relatedTarget;
                if (!(next instanceof Node) || !event.currentTarget.contains(next)) setSearchOpen(false);
              }}
            >
              <label className="header-search-input">
                <Search aria-hidden="true" size={19} />
                <span className="sr-only">Search the G20 website</span>
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search membership, products, calculators or help"
                  aria-controls={searchResultsId}
                />
              </label>
              {searchOpen && (
                <section id={searchResultsId} className="header-search-panel" aria-label="Search suggestions">
                  <div className="header-search-panel__top"><p className="eyebrow">Suggested destinations</p><span>{results.length} result{results.length === 1 ? "" : "s"}</span></div>
                  <div className="search-results" aria-live="polite">
                    {results.map((item) => <Link href={item.href} key={item.href}><strong>{item.title}</strong><span>{item.text}</span></Link>)}
                    {results.length === 0 && <p>No exact match. Ask G20 for guided help.</p>}
                  </div>
                  <Link href={`/ask-g20${query ? `?q=${encodeURIComponent(query)}` : ""}`} className="search-ask"><Sparkles /> Ask G20 about “{query || "my options"}”</Link>
                </section>
              )}
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="sheet-backdrop" role="presentation" onMouseDown={() => setMenuOpen(false)}>
          <div className="mobile-sheet" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title" onMouseDown={(event) => event.stopPropagation()}>
            <div className="mobile-sheet__header"><Brand /><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X /></button></div>
            <h2 id="mobile-menu-title" className="sr-only">Site navigation</h2>
            <nav className="mobile-nav">
              {primaryNav.map((item) => <Link key={item.href} href={item.href}>{item.label}<span aria-hidden="true">→</span></Link>)}
            </nav>
            <div className="mobile-sheet__actions">
              <Link href="/join" className="button button--primary">Start membership application</Link>
              <Link href="/application-status" className="button button--secondary">Track an application</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
