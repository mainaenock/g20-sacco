export type ProductKind = "loan" | "savings";
export type Availability = "available" | "preview" | "inactive";
export type PaymentStatus =
  | "AWAITING_PAYMENT"
  | "PROCESSING"
  | "PAID"
  | "PARTIALLY_PAID"
  | "OVERPAID_REVIEW"
  | "FAILED"
  | "CANCELLED"
  | "CONFIRMATION_PENDING";

export interface Product {
  id: string;
  slug: string;
  kind: ProductKind;
  name: string;
  eyebrow: string;
  summary: string;
  audience: string[];
  goals: string[];
  availability: Availability;
  effectiveDate: string;
  rate?: { value: number; unit: "% p.a."; method: "reducing balance" | "flat" | "annual yield assumption" };
  termMonths?: { min: number; max: number };
  facts: { label: string; value: string }[];
  benefits: string[];
  requirements: string[];
  disclaimer: string;
}

export interface Branch {
  id: string;
  slug: string;
  name: string;
  county: string;
  address: string;
  hours: string;
  services: string[];
  accessibility: string;
  demo: true;
}

export interface ContentItem {
  id: string;
  slug: string;
  type: "guide" | "news" | "notice" | "event" | "report";
  title: string;
  summary: string;
  category: string;
  publishedAt: string;
  readingMinutes?: number;
  demo: true;
}

export interface ApplicationDraft {
  id: string;
  reference: string;
  step: number;
  membershipType?: string;
  paymentStatus: PaymentStatus;
  updatedAt: string;
}

export interface ProductFilters {
  goal?: string;
  audience?: string;
  kind?: ProductKind;
}

export interface ProductService {
  list(filters?: ProductFilters): Promise<Product[]>;
  get(slug: string): Promise<Product | null>;
  compare(ids: string[]): Promise<Product[]>;
}

export interface ApplicationService {
  createDraft(membershipType: string): Promise<ApplicationDraft>;
  saveStep(id: string, step: number, payload: unknown): Promise<ApplicationDraft>;
  getStatus(reference: string): Promise<ApplicationDraft | null>;
}

export interface ChatSource {
  label: string;
  href: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  label?: "General information" | "Estimate" | "Preliminary recommendation";
  sources?: ChatSource[];
}
