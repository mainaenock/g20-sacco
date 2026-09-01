"use client";

import { FormEvent, useState } from "react";
import { AlertTriangle, CheckCircle2, Paperclip, Send, ShieldAlert } from "lucide-react";
import { track } from "@/lib/analytics";

type FormType = "contact" | "callback" | "complaint" | "feedback" | "fraud" | "whistleblowing";

const copy: Record<FormType, { title: string; body: string; submit: string; warning?: string }> = {
  contact: { title: "Send a general enquiry", body: "Share what you need help with and your preferred response channel.", submit: "Send enquiry" },
  callback: { title: "Request a callback", body: "Choose a topic and a suitable time. Official contact details will be used only when configured.", submit: "Request callback" },
  complaint: { title: "Tell us what happened", body: "Provide the service, issue, impact and the resolution you would like.", submit: "Submit complaint" },
  feedback: { title: "Share feedback", body: "Send a compliment, suggestion or service improvement idea.", submit: "Send feedback" },
  fraud: { title: "Report suspected fraud", body: "Use this form for non-urgent reporting. Production routing must protect evidence and identity.", submit: "Submit secure report", warning: "Never include your M-Pesa PIN, password or OTP. If money is actively at risk, use a verified urgent channel." },
  whistleblowing: { title: "Whistleblowing report", body: "This route is separate from normal complaints. Confidentiality language remains subject to an approved G20 policy.", submit: "Submit report", warning: "The confidentiality and anonymity model shown here is a frontend placeholder until an approved policy and secure reporting provider are configured." },
};

export function SupportForm({ type }: { type: FormType }) {
  const [submitted, setSubmitted] = useState(false);
  const [consent, setConsent] = useState(false);
  const details = copy[type];

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!consent) return;
    track(type === "complaint" ? "complaint_submitted" : "lead_submitted", { form_type: type });
    setSubmitted(true);
  }

  if (submitted) return <div className="success-panel"><CheckCircle2 size={52} /><h2 style={{ marginTop: 18 }}>Your demonstration request is recorded.</h2><p>Reference: DEMO-{type.toUpperCase()}-2048. No real message was sent. A production service will generate the authoritative reference and delivery status.</p><button type="button" className="button button--secondary" onClick={() => setSubmitted(false)}>Submit another demo</button></div>;

  return <div className="form-page"><form className="form-card" onSubmit={submit}><h2>{details.title}</h2><p>{details.body}</p>{details.warning && <div className="alert alert--warning"><AlertTriangle />{details.warning}</div>}<div className="form-grid form-grid--two"><div className="field"><label htmlFor={`${type}-name`}>Name</label><input id={`${type}-name`} className="input" autoComplete="name" required /></div><div className="field"><label htmlFor={`${type}-phone`}>Phone</label><input id={`${type}-phone`} className="input" type="tel" inputMode="tel" autoComplete="tel" required /></div><div className="field"><label htmlFor={`${type}-category`}>Topic</label><select id={`${type}-category`} className="select" required><option value="">Select a topic</option><option>Membership</option><option>Savings</option><option>Borrowing</option><option>Digital service</option><option>Payment</option><option>Service experience</option><option>Security concern</option></select></div><div className="field"><label htmlFor={`${type}-preference`}>Preferred response</label><select id={`${type}-preference`} className="select"><option>Phone call</option><option>Email</option><option>SMS</option></select></div></div><div className="field" style={{ marginTop: 18 }}><label htmlFor={`${type}-details`}>Details</label><textarea id={`${type}-details`} className="textarea" required minLength={20} placeholder="Include what happened, when, the service involved and what a helpful resolution would look like." /></div>{["complaint", "fraud", "whistleblowing"].includes(type) && <div className="upload-card" style={{ marginTop: 16 }}><Paperclip /><strong style={{ marginLeft: 8 }}>Optional attachment</strong><p className="help-text">Frontend demonstration only. Production must validate, scan and securely store allowed file types.</p><input type="file" accept="image/*,.pdf" /></div>}<label className="consent-card" style={{ marginTop: 18 }}><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} /><span><strong>I understand how this information will be used</strong><small style={{ display: "block" }}>The approved privacy notice and retention terms must replace this demonstration copy.</small></span></label><button type="submit" className="button button--primary" style={{ marginTop: 20 }} disabled={!consent}><Send /> {details.submit}</button></form><aside><div className="trust-card"><ShieldAlert color="var(--brand)" /><h2 style={{ fontSize: "1.45rem", marginTop: 18 }}>Protect sensitive details</h2><p>Do not send PINs, passwords, OTPs, full card details or unrequested identity documents. Production errors must never reveal provider payloads or internal IDs.</p></div></aside></div>;
}
