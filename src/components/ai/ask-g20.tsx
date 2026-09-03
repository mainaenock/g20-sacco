"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bot, ExternalLink, Pause, RotateCcw, Send, ShieldCheck, Sparkles } from "lucide-react";
import type { ChatMessage } from "@/types";
import { track } from "@/lib/analytics";

const suggestions = ["How do I join?", "What documents may I need?", "Help me estimate a loan", "How do I verify official channels?"];

function answerFor(text: string): Omit<ChatMessage, "id" | "role"> {
  const q = text.toLowerCase();
  if (q.includes("join") || q.includes("member")) return {
    label: "General information",
    content: "You can start with the membership guide, choose a membership type, verify your contact details, complete the configured details and upload the required KYC documents. A registration payment—if configured—does not mean membership is approved. You will be able to track the separate review status.",
    sources: [{ label: "How membership works", href: "/membership/how-it-works" }, { label: "Start application", href: "/join" }],
  };
  if (q.includes("document") || q.includes("kyc")) return {
    label: "General information",
    content: "The demonstration checklist includes identity, KRA PIN certificate, photo and membership-type documents. The authoritative checklist must come from G20 configuration. Never send identity documents through ordinary chat or unverified email.",
    sources: [{ label: "Membership requirements", href: "/membership/requirements" }, { label: "Security centre", href: "/security" }],
  };
  if (q.includes("loan") || q.includes("repay") || q.includes("afford")) return {
    label: "Estimate",
    content: "I can route you to the deterministic repayment calculator. It can compare reducing-balance and flat-method illustrations, show total interest and display assumptions. The result remains preliminary and is never an approval.",
    sources: [{ label: "Loan repayment calculator", href: "/calculators/loan-repayment" }, { label: "Borrowing options", href: "/borrow" }],
  };
  if (q.includes("pay") || q.includes("pin") || q.includes("official") || q.includes("security")) return {
    label: "General information",
    content: "Do not share your M-Pesa PIN, password or one-time code. Verify G20 payment and contact details only through approved official channels. This demo intentionally does not show unverified phone, Paybill or branch information.",
    sources: [{ label: "Security centre", href: "/security" }, { label: "Report fraud", href: "/report-fraud" }],
  };
  return {
    label: "Preliminary recommendation",
    content: "I can help you explore membership, savings, borrowing, calculators, branches, security and application status. Because this is a frontend demonstration, all institutional and financial details remain configuration-driven until G20 approves them.",
    sources: [{ label: "Help centre", href: "/help" }, { label: "Explore products", href: "/borrow" }],
  };
}

export function AskG20() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "welcome", role: "assistant", label: "General information", content: "Hello—I'm Ask G20. I can guide you to clear information, deterministic calculators and the right next step. What would you like to understand?", sources: [{ label: "How I can help", href: "/help" }] },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
  }, []);

  function send(text: string) {
    if (!text.trim() || streaming) return;
    track("ask_g20_started", { intent: "guided-help" });
    const user: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    setMessages((current) => [...current, user]);
    setInput("");
    setStreaming(true);
    timerRef.current = window.setTimeout(() => {
      if (unavailable) {
        setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", label: "General information", content: "Ask G20 is temporarily unavailable. Search, calculators and the help centre are still available.", sources: [{ label: "Search help", href: "/help" }, { label: "Calculators", href: "/calculators" }] }]);
      } else {
        setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", ...answerFor(text) }]);
      }
      setStreaming(false);
    }, 850);
  }

  function submit(event: FormEvent) { event.preventDefault(); send(input); }
  function stop() { if (timerRef.current) window.clearTimeout(timerRef.current); setStreaming(false); }

  return (
    <div className="chat-shell">
      <aside className="chat-sidebar">
        <Sparkles /><h2 style={{ fontSize: "1.6rem", marginTop: 18 }}>Ask G20</h2><p style={{ color: "#cfcfe6" }}>Guided information with visible source links and deliberate handoff.</p>
        <nav aria-label="Suggested questions">{suggestions.map((item) => <button key={item} type="button" onClick={() => send(item)}>{item}</button>)}</nav>
        <label className="consent-card" style={{ marginTop: 22, background: "rgba(255,255,255,.08)" }}><input type="checkbox" checked={unavailable} onChange={(event) => setUnavailable(event.target.checked)} /><span><strong>Demo unavailable state</strong><small style={{ display: "block", color: "#cfcfe6" }}>Test the smart-search fallback.</small></span></label>
      </aside>
      <section className="chat-main">
        <header className="chat-header"><div className="chat-header__identity"><span className="chat-avatar"><Bot /></span><div><strong>Ask G20</strong><small>{streaming ? "Preparing a response…" : unavailable ? "Fallback mode ready" : "Demo assistant online"}</small></div></div><span className="badge badge--success">Information only</span></header>
        <div className="chat-messages" role="log" aria-live="polite" aria-relevant="additions">
          {messages.map((message) => <article key={message.id} className={`message message--${message.role}`}><div className="message__bubble"><p style={{ margin: 0 }}>{message.content}</p></div>{message.role === "assistant" && <div className="message__meta">{message.label && <span className="badge badge--info">{message.label}</span>}{message.sources?.map((source) => <Link className="source-chip" href={source.href} key={source.href}>Based on: {source.label} <ExternalLink size={12} /></Link>)}</div>}</article>)}
          {streaming && <article className="message"><div className="message__bubble"><span className="spin" style={{ display: "inline-block" }}>✦</span> Checking approved demo content…</div></article>}
        </div>
        <form className="chat-composer" onSubmit={submit}>
          <div className="suggestions">{suggestions.slice(0, 3).map((item) => <button type="button" key={item} onClick={() => send(item)}>{item}</button>)}</div>
          <div className="composer-row"><label className="sr-only" htmlFor="chat-input">Message Ask G20</label><textarea id="chat-input" rows={1} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about membership, products or support…" />{streaming ? <button type="button" onClick={stop} aria-label="Stop response"><Pause /></button> : <button type="submit" disabled={!input.trim()} aria-label="Send message"><Send /></button>}</div>
          <p className="privacy-cue"><ShieldCheck size={13} style={{ verticalAlign: "middle" }} /> Do not enter your M-Pesa PIN, password, OTP, ID number or KRA PIN. <Link href="/privacy">Privacy guidance</Link>.</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}><Link className="button button--ghost" href="/request-callback">Request callback</Link><Link className="button button--ghost" href="/contact">Contact support</Link><button type="button" className="button button--ghost" onClick={() => setMessages((current) => current.slice(0, 1))}><RotateCcw size={16} /> Start over</button></div>
        </form>
      </section>
    </div>
  );
}
