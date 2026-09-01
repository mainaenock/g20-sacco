"use client";

import { FormEvent, useState } from "react";
import { AlertCircle, CheckCircle2, FileWarning, LockKeyhole, Search, ShieldCheck } from "lucide-react";

const timeline = [
  { title: "Application received", body: "Demonstration record created.", state: "done" },
  { title: "Payment confirmed", body: "Payment status is confirmed separately.", state: "done" },
  { title: "Under review", body: "The application is being checked against configured requirements.", state: "active" },
  { title: "Official decision", body: "No decision has been made in this demonstration.", state: "future" },
];

export function ApplicationStatus() {
  const [reference, setReference] = useState("DEMO-G20-8A4F2C");
  const [phone, setPhone] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!reference.toUpperCase().startsWith("DEMO-") || phone.replace(/\D/g, "").length < 9) { setError("Use a DEMO- reference and a valid phone format to verify the demonstration record."); return; }
    setError(""); setVerified(true);
  }

  if (!verified) return <div className="form-page"><form className="form-card" onSubmit={submit}><LockKeyhole color="var(--brand)" /><h2 style={{ marginTop: 18 }}>Verify before viewing status</h2><p>No personal information is shown until the application reference and second factor pass verification.</p>{error && <div className="alert alert--danger" role="alert"><AlertCircle />{error}</div>}<div className="form-grid"><div className="field"><label htmlFor="status-reference">Application reference</label><input id="status-reference" className="input" autoCapitalize="characters" value={reference} onChange={(event) => setReference(event.target.value)} /></div><div className="field"><label htmlFor="status-phone">Mobile number used in application</label><input id="status-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Use any valid demo format" /></div><button className="button button--primary" type="submit"><Search /> Verify and view status</button></div></form><aside className="trust-card"><ShieldCheck color="var(--brand)" /><h2 style={{ fontSize: "1.45rem", marginTop: 18 }}>Safe tracking</h2><p>Never enter an M-Pesa PIN, OTP, ID number or KRA PIN to check an application. Production verification must be rate-limited and server-side.</p></aside></div>;

  return <div className="detail-grid"><div className="form-card"><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12 }}><div><p className="eyebrow">Application {reference.toUpperCase()}</p><h2>Under review</h2></div><span className="badge badge--warning">APPLICATION: UNDER REVIEW</span></div><div className="timeline" style={{ marginTop: 26 }}>{timeline.map((item) => <div key={item.title} className={`timeline-item timeline-item--${item.state}`}><h3>{item.title}</h3><p>{item.body}</p></div>)}</div></div><aside><div className="form-card"><p className="eyebrow">Payment status</p><h2><span className="badge badge--success">PAID</span></h2><p>Payment confirmed remains separate from the application decision.</p></div><div className="form-card" style={{ marginTop: 16 }}><FileWarning color="var(--warning)" /><h2 style={{ marginTop: 16 }}>Change requested</h2><p>The demo reviewer needs a clearer identity document image. Other submitted details remain preserved.</p><button className="button button--secondary" type="button"><CheckCircle2 /> Open safe re-upload</button></div></aside></div>;
}
