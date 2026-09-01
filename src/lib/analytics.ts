export type AnalyticsEvent =
  | "page_view"
  | "nav_click"
  | "join_started"
  | "join_step_completed"
  | "kyc_upload_started"
  | "registration_payment_started"
  | "registration_payment_confirmed"
  | "calculator_started"
  | "calculator_completed"
  | "product_compared"
  | "ask_g20_started"
  | "ask_g20_tool_used"
  | "lead_submitted"
  | "complaint_submitted"
  | "branch_viewed"
  | "article_read"
  | "cta_clicked";

type SafeProperties = Record<string, string | number | boolean | undefined>;

export function track(event: AnalyticsEvent, properties: SafeProperties = {}) {
  if (process.env.NODE_ENV !== "production") {
    // Development-only adapter. Never add phone, email, ID, filenames, transcript text or receipts.
    console.info("[analytics]", event, properties);
  }
}
