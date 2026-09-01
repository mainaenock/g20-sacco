import { products } from "@/mocks/fixtures";
import type { ApplicationDraft, ApplicationService, ProductFilters, ProductService } from "@/types";

const delay = (ms = 180) => new Promise<void>((resolve) => setTimeout(resolve, ms));

class MockProductService implements ProductService {
  async list(filters?: ProductFilters) {
    await delay();
    return products.filter((product) => {
      if (filters?.kind && product.kind !== filters.kind) return false;
      if (filters?.goal && !product.goals.includes(filters.goal)) return false;
      if (filters?.audience && !product.audience.includes(filters.audience)) return false;
      return true;
    });
  }

  async get(slug: string) {
    await delay(100);
    return products.find((product) => product.slug === slug) ?? null;
  }

  async compare(ids: string[]) {
    await delay();
    return products.filter((product) => ids.includes(product.id)).slice(0, 4);
  }
}

class MockApplicationService implements ApplicationService {
  private drafts = new Map<string, ApplicationDraft>();

  async createDraft(membershipType: string) {
    await delay();
    const id = crypto.randomUUID();
    const draft: ApplicationDraft = {
      id,
      reference: `DEMO-${id.slice(0, 8).toUpperCase()}`,
      step: 1,
      membershipType,
      paymentStatus: "AWAITING_PAYMENT",
      updatedAt: new Date().toISOString(),
    };
    this.drafts.set(id, draft);
    return draft;
  }

  async saveStep(id: string, step: number, payload: unknown) {
    await delay();
    void payload;
    const current = this.drafts.get(id);
    if (!current) throw new Error("The demonstration draft could not be found.");
    const next = { ...current, step, updatedAt: new Date().toISOString() };
    this.drafts.set(id, next);
    return next;
  }

  async getStatus(reference: string): Promise<ApplicationDraft | null> {
    await delay();
    if (!reference.toUpperCase().startsWith("DEMO-")) return null;
    const record: ApplicationDraft = {
      id: "verified-demo-record",
      reference: reference.toUpperCase(),
      step: 8,
      membershipType: "Demo individual membership",
      paymentStatus: "PAID",
      updatedAt: new Date().toISOString(),
    };
    return record;
  }
}

export const productService: ProductService = new MockProductService();
export const applicationService: ApplicationService = new MockApplicationService();
