"use client";

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3, LoaderCircle, LockKeyhole, PhoneCall, RotateCcw, Save, UploadCloud, XCircle } from "lucide-react";
import { formatKES, normalizeKenyanPhone } from "@/lib/format";
import type { PaymentStatus } from "@/types";
import { track } from "@/lib/analytics";

type FormData = {
  membershipType: string;
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  idType: string;
  county: string;
  town: string;
  occupation: string;
  sourceOfFunds: string;
  privacyConsent: boolean;
  declarationConsent: boolean;
};

type UploadRecord = { name: string; status: "ready" | "uploading" | "uploaded" | "rejected" };

const initialData: FormData = { membershipType: "", phone: "", email: "", firstName: "", lastName: "", idType: "National ID", county: "", town: "", occupation: "", sourceOfFunds: "", privacyConsent: false, declarationConsent: false };
const steps = ["Membership type", "Contact verification", "Personal details", "Address & work", "KYC documents", "Review & consent", "Registration fee", "Confirmation"];
const membershipOptions = [
  { id: "individual", title: "Individual", body: "A demonstration personal membership application." },
  { id: "joint", title: "Joint", body: "A configurable journey for two applicants." },
  { id: "group", title: "Group / chama", body: "A demonstration entity and signatory journey." },
  { id: "corporate", title: "Corporate", body: "A configurable business membership journey." },
  { id: "diaspora", title: "Diaspora", body: "A remote-first journey when officially enabled." },
];
const registrationFees: Record<string, number> = { individual: 1000, joint: 1500, group: 2500, corporate: 5000, diaspora: 2000 };

export function JoinApplication() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<FormData>(initialData);
  const [saved, setSaved] = useState(false);
  const [verified, setVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const [uploads, setUploads] = useState<Record<string, UploadRecord>>({});
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("AWAITING_PAYMENT");
  const [paymentScenario, setPaymentScenario] = useState<"success" | "failed" | "timeout" | "cancelled">("success");
  const [reference] = useState("DEMO-G20-8A4F2C");
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const stored = window.localStorage.getItem("g20-demo-application");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { step: number; data: FormData };
        // Restoring the external draft after hydration intentionally synchronizes client state.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setStep(Math.min(parsed.step, 6));
        setData({ ...initialData, ...parsed.data });
      } catch { window.localStorage.removeItem("g20-demo-application"); }
    }
  }, []);

  const fee = registrationFees[data.membershipType] ?? 0;
  const progress = ((step + 1) / steps.length) * 100;
  const requiredUploads = useMemo(() => ["Identity document", "KRA PIN certificate", "Passport photo", ...(data.membershipType === "group" || data.membershipType === "corporate" ? ["Registration certificate", "Signatory mandate"] : [])], [data.membershipType]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) { setData((current) => ({ ...current, [key]: value })); setSaved(false); }
  function saveDraft(nextStep = step) {
    const safe = { ...data };
    window.localStorage.setItem("g20-demo-application", JSON.stringify({ step: Math.min(nextStep, 6), data: safe }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function validate(): string[] {
    const issues: string[] = [];
    if (step === 0 && !data.membershipType) issues.push("Choose a membership type.");
    if (step === 1) {
      if (!normalizeKenyanPhone(data.phone)) issues.push("Enter a valid Kenyan mobile number in 07xx, 01xx or +254 format.");
      if (!/^\S+@\S+\.\S+$/.test(data.email)) issues.push("Enter a valid email address.");
      if (!verified) issues.push("Complete the demonstration phone verification.");
    }
    if (step === 2 && (!data.firstName.trim() || !data.lastName.trim())) issues.push("Enter your first and last name.");
    if (step === 3 && (!data.county.trim() || !data.town.trim() || !data.sourceOfFunds)) issues.push("Complete county, town and source of funds.");
    if (step === 4 && requiredUploads.some((item) => uploads[item]?.status !== "uploaded")) issues.push("Upload every required demonstration document.");
    if (step === 5 && (!data.privacyConsent || !data.declarationConsent)) issues.push("Accept both required declarations.");
    return issues;
  }

  function next(event?: FormEvent) {
    event?.preventDefault();
    const issues = validate();
    setErrors(issues);
    if (issues.length) { window.requestAnimationFrame(() => document.getElementById("form-errors")?.focus()); return; }
    const nextStep = Math.min(steps.length - 1, step + 1);
    saveDraft(nextStep);
    track("join_step_completed", { step: step + 1, membership_type: data.membershipType });
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function upload(label: string, event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    track("kyc_upload_started", { document_type: label.toLowerCase().replaceAll(" ", "-") });
    setUploads((current) => ({ ...current, [label]: { name: file.name, status: "uploading" } }));
    window.setTimeout(() => setUploads((current) => ({ ...current, [label]: { name: file.name, status: file.size > 8 * 1024 * 1024 ? "rejected" : "uploaded" } })), 700);
  }

  function verifyOtp() {
    if (otp === "246810") setVerified(true);
    else setErrors(["Use demonstration code 246810 to continue."]);
  }

  function startPayment() {
    setPaymentStatus("PROCESSING");
    track("registration_payment_started", { membership_type: data.membershipType });
    window.setTimeout(() => {
      const mapped: Record<typeof paymentScenario, PaymentStatus> = { success: "PAID", failed: "FAILED", timeout: "CONFIRMATION_PENDING", cancelled: "CANCELLED" };
      const status = mapped[paymentScenario];
      setPaymentStatus(status);
      if (status === "PAID") track("registration_payment_confirmed", { membership_type: data.membershipType });
    }, 1400);
  }

  function reset() { window.localStorage.removeItem("g20-demo-application"); setData(initialData); setStep(0); setVerified(false); setUploads({}); setPaymentStatus("AWAITING_PAYMENT"); setErrors([]); }

  return (
    <div className="application-shell">
      <aside className="progress-card" aria-label="Application progress">
        <div className="progress-card__top"><strong>Step {step + 1} of {steps.length}</strong><span>{Math.round(progress)}%</span></div>
        <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
        <h2 style={{ fontSize: "1.25rem", marginTop: 18 }}>{steps[step]}</h2>
        <p className="help-text">This demo saves entered form fields on this device. Selected KYC files are never stored in localStorage.</p>
        <div style={{ display: "grid", gap: 8, marginTop: 16 }}>{steps.map((label, index) => <span key={label} style={{ display: "flex", gap: 8, color: index === step ? "var(--brand)" : index < step ? "var(--success)" : "var(--muted)", fontSize: ".8rem", fontWeight: index === step ? 800 : 500 }}>{index < step ? <Check size={15} /> : <span style={{ width: 15, textAlign: "center" }}>{index + 1}</span>}{label}</span>)}</div>
      </aside>
      <form className="step-form" onSubmit={next} noValidate>
        {errors.length > 0 && <div id="form-errors" tabIndex={-1} className="alert alert--danger" role="alert"><AlertCircle /><div><strong>Please fix the following:</strong><ul>{errors.map((error) => <li key={error}>{error}</li>)}</ul></div></div>}

        {step === 0 && <><div className="step-form__head"><p className="eyebrow">Welcome</p><h2>Choose the membership path that fits.</h2><p>Each option controls the configured details, documents and authoritative registration fee later in the journey.</p></div><div className="membership-options">{membershipOptions.map((option) => <label className="choice-card" key={option.id}><input type="radio" name="membershipType" value={option.id} checked={data.membershipType === option.id} onChange={() => update("membershipType", option.id)} /><span><strong>{option.title}</strong><small>{option.body}</small></span></label>)}</div></>}

        {step === 1 && <><div className="step-form__head"><p className="eyebrow">Contact verification</p><h2>How can we reach you?</h2><p>Use demo details only. In production, verification and secure session handling move to server services.</p></div><div className="form-grid"><div className="field"><label htmlFor="join-phone">Kenyan mobile number</label><input id="join-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" enterKeyHint="next" value={data.phone} onChange={(event) => update("phone", event.target.value)} placeholder="07xx xxx xxx or +254…" /></div><div className="field"><label htmlFor="join-email">Email address</label><input id="join-email" className="input" type="email" inputMode="email" autoComplete="email" enterKeyHint="next" value={data.email} onChange={(event) => update("email", event.target.value)} /></div><div className="field"><label htmlFor="join-otp">Demonstration verification code</label><div style={{ display: "flex", gap: 8 }}><input id="join-otp" className="input" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))} placeholder="Use 246810" /><button type="button" className="button button--secondary" onClick={verifyOtp}>{verified ? <CheckCircle2 /> : <PhoneCall />} {verified ? "Verified" : "Verify"}</button></div></div></div></>}

        {step === 2 && <><div className="step-form__head"><p className="eyebrow">Personal or entity details</p><h2>Tell us who is applying.</h2><p>The production schema will render fields appropriate to {data.membershipType || "the selected membership type"}.</p></div><div className="form-grid form-grid--two"><div className="field"><label htmlFor="first-name">First name</label><input id="first-name" className="input" autoComplete="given-name" value={data.firstName} onChange={(event) => update("firstName", event.target.value)} /></div><div className="field"><label htmlFor="last-name">Last name</label><input id="last-name" className="input" autoComplete="family-name" value={data.lastName} onChange={(event) => update("lastName", event.target.value)} /></div><div className="field"><label htmlFor="id-type">Identity document type</label><select id="id-type" className="select" value={data.idType} onChange={(event) => update("idType", event.target.value)}><option>National ID</option><option>Passport</option><option>Configured entity document</option></select><small>Do not enter the document number in this frontend demonstration.</small></div></div></>}

        {step === 3 && <><div className="step-form__head"><p className="eyebrow">Address and work</p><h2>Add the details required by the configured schema.</h2><p>Source-of-funds and employment questions should appear only when operationally required.</p></div><div className="form-grid form-grid--two"><div className="field"><label htmlFor="county">County</label><input id="county" className="input" autoComplete="address-level1" value={data.county} onChange={(event) => update("county", event.target.value)} /></div><div className="field"><label htmlFor="town">Town / area</label><input id="town" className="input" autoComplete="address-level2" value={data.town} onChange={(event) => update("town", event.target.value)} /></div><div className="field"><label htmlFor="occupation">Occupation or business activity</label><input id="occupation" className="input" autoComplete="organization-title" value={data.occupation} onChange={(event) => update("occupation", event.target.value)} /></div><div className="field"><label htmlFor="source-funds">Primary source of funds</label><select id="source-funds" className="select" value={data.sourceOfFunds} onChange={(event) => update("sourceOfFunds", event.target.value)}><option value="">Select one</option><option>Employment income</option><option>Business income</option><option>Investments</option><option>Pension</option><option>Other configured source</option></select></div></div></>}

        {step === 4 && <><div className="step-form__head"><p className="eyebrow">KYC documents</p><h2>Upload from your phone or computer.</h2><p>Tap each control to choose or capture an image. Files are held only in browser memory in this demonstration.</p></div><div className="alert alert--warning"><LockKeyhole /><span>Never send documents through Ask G20. Production uploads require encrypted transport, malware checks and secure object storage.</span></div><div className="upload-list">{requiredUploads.map((label) => { const record = uploads[label]; return <div className="upload-card" key={label}><div className="upload-card__top"><div><strong>{label}</strong><small style={{ display: "block", color: "var(--muted)" }}>PDF, JPG or PNG · max 8 MB</small></div>{record?.status === "uploading" ? <LoaderCircle className="spin" /> : record?.status === "uploaded" ? <CheckCircle2 color="var(--success)" /> : record?.status === "rejected" ? <XCircle color="var(--danger)" /> : <UploadCloud color="var(--brand)" />}</div><input type="file" accept="image/*,.pdf" capture={label === "Passport photo" ? "user" : undefined} onChange={(event) => upload(label, event)} aria-label={`Upload ${label}`} />{record && <p className={record.status === "rejected" ? "alert alert--danger" : "help-text"} style={{ marginTop: 10, marginBottom: 0 }}>{record.status === "rejected" ? "File is too large. Choose a file under 8 MB and retry." : `${record.name} · ${record.status}`}</p>}</div>})}</div></>}

        {step === 5 && <><div className="step-form__head"><p className="eyebrow">Review and consent</p><h2>Check before creating the record.</h2><p>Use the Back action to edit any section. Sensitive identifiers are intentionally not collected in this demo.</p></div><div className="review-list"><div className="review-row"><span>Membership type</span><strong>{data.membershipType}</strong></div><div className="review-row"><span>Applicant</span><strong>{data.firstName} {data.lastName}</strong></div><div className="review-row"><span>Contact</span><strong>{normalizeKenyanPhone(data.phone)} · {data.email}</strong></div><div className="review-row"><span>Location</span><strong>{data.town}, {data.county}</strong></div><div className="review-row"><span>Documents ready</span><strong>{requiredUploads.length} demonstration files</strong></div></div><div style={{ display: "grid", gap: 12, marginTop: 22 }}><label className="consent-card"><input type="checkbox" checked={data.privacyConsent} onChange={(event) => update("privacyConsent", event.target.checked)} /><span><strong>Privacy acknowledgement</strong><small style={{ display: "block" }}>I have reviewed the placeholder privacy notice and understand real processing depends on an approved policy.</small></span></label><label className="consent-card"><input type="checkbox" checked={data.declarationConsent} onChange={(event) => update("declarationConsent", event.target.checked)} /><span><strong>Application declaration</strong><small style={{ display: "block" }}>I understand this creates an application for review, not automatic membership activation.</small></span></label></div></>}

        {step === 6 && <><div className="step-form__head"><p className="eyebrow">Configured registration fee</p><h2>Confirm the amount, then approve on your phone.</h2><p>The fee comes from the selected membership configuration. You cannot edit the authoritative amount.</p></div><div className="payment-card"><div><small>Demonstration registration fee</small><div className="payment-amount">{formatKES(fee)}</div><small>For {data.membershipType} membership · demo configuration</small></div><div className="field"><label htmlFor="payment-scenario">Developer scenario</label><select id="payment-scenario" className="select" value={paymentScenario} onChange={(event) => { setPaymentScenario(event.target.value as typeof paymentScenario); setPaymentStatus("AWAITING_PAYMENT"); }}><option value="success">STK success</option><option value="failed">STK failed</option><option value="timeout">Confirmation pending / timeout</option><option value="cancelled">User cancelled</option></select></div><PaymentState status={paymentStatus} amount={fee} onStart={startPayment} />{paymentStatus === "PAID" && <button className="button button--primary" type="button" onClick={() => { setStep(7); window.localStorage.removeItem("g20-demo-application"); }}>Submit application for review <ArrowRight /></button>}<details><summary>Manual Paybill fallback</summary><p>Official Paybill and account instructions will appear only when supplied by verified backend configuration. No unverified payment details are displayed.</p></details></div></>}

        {step === 7 && <><div className="success-panel"><CheckCircle2 size={52} /><p className="eyebrow" style={{ marginTop: 18 }}>Application submitted</p><h2>Your application is ready for official review.</h2><p>Payment confirmed does not mean membership approved. Keep your demonstration reference to explore tracking.</p><div className="payment-card" style={{ textAlign: "left", marginBlock: 24 }}><div className="review-row"><span>Application reference</span><strong style={{ overflowWrap: "anywhere" }}>{reference}</strong></div><div className="review-row"><span>Payment</span><strong><span className="badge badge--success">PAID</span></strong></div><div className="review-row"><span>Application</span><strong><span className="badge badge--warning">UNDER REVIEW</span></strong></div></div><div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8 }}><Link href={`/application-status?reference=${reference}`} className="button button--primary">Track application</Link><button type="button" className="button button--secondary" onClick={reset}><RotateCcw /> Start another demo</button></div></div></>}

        {step < 6 && <div className="step-actions"><button type="button" className="button button--secondary" disabled={step === 0} onClick={() => setStep((current) => Math.max(0, current - 1))}><ArrowLeft /> Back</button><button type="button" className="button button--ghost" onClick={() => saveDraft()}><Save /> {saved ? "Saved on this device" : "Save and continue later"}</button><button type="submit" className="button button--primary">Continue <ArrowRight /></button></div>}
      </form>
    </div>
  );
}

function PaymentState({ status, amount, onStart }: { status: PaymentStatus; amount: number; onStart: () => void }) {
  const content: Record<PaymentStatus, { icon: typeof Clock3; title: string; body: string; tone: string }> = {
    AWAITING_PAYMENT: { icon: PhoneCall, title: "Ready for M-Pesa STK Push", body: `A prompt will be simulated for ${formatKES(amount)}. Check the organisation and amount before entering your PIN on your phone.`, tone: "var(--brand)" },
    PROCESSING: { icon: LoaderCircle, title: "Waiting for confirmation", body: "Do not retry or close this screen yet. A pending confirmation is not a failure.", tone: "var(--warning)" },
    PAID: { icon: CheckCircle2, title: "Payment confirmed", body: "A demonstration receipt is ready. Membership approval is still a separate review.", tone: "var(--success)" },
    PARTIALLY_PAID: { icon: AlertCircle, title: "Partial payment review", body: "Support review is required before the application can continue.", tone: "var(--warning)" },
    OVERPAID_REVIEW: { icon: AlertCircle, title: "Overpayment review", body: "Finance review is required. Do not make another payment.", tone: "var(--warning)" },
    FAILED: { icon: XCircle, title: "Payment was not completed", body: "No confirmation was received. Check your phone and try again when ready.", tone: "var(--danger)" },
    CANCELLED: { icon: XCircle, title: "Payment cancelled", body: "You cancelled the prompt. Your application details remain available.", tone: "var(--danger)" },
    CONFIRMATION_PENDING: { icon: Clock3, title: "Confirmation pending", body: "The request timed out, but that is not proof of failure. Wait for reconciliation before retrying.", tone: "var(--warning)" },
  };
  const current = content[status]; const Icon = current.icon;
  return <div className="payment-status" role="status" aria-live="polite"><Icon className={status === "PROCESSING" ? "spin" : ""} color={current.tone} /><div style={{ flex: 1 }}><strong>{current.title}</strong><p className="help-text" style={{ margin: "4px 0 10px" }}>{current.body}</p>{status !== "PAID" && status !== "PROCESSING" && status !== "CONFIRMATION_PENDING" && <button type="button" className="button button--primary" onClick={onStart}>Send STK Push</button>}{status === "CONFIRMATION_PENDING" && <button type="button" className="button button--secondary" onClick={onStart}>Check again</button>}</div></div>;
}
