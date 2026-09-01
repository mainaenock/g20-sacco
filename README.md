# Great 20 Sacco digital branch

A mobile-first Next.js 16 frontend for the visible G20 SACCO digital branch: public product discovery, deterministic calculators, guided Ask G20 help, digital membership application, KYC upload UI, M-Pesa state simulation, application tracking, support flows, content routes, branches and website administration.

The supplied G20 logo drives the indigo/gold visual system. All rates, fees, branch records, metrics, application records and institutional facts in the frontend are explicitly marked demonstration data. Replace them with approved, effective-dated backend or CMS content before production.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. The full happy-path membership application uses demo OTP `246810`. File selections remain only in browser memory and are never written to `localStorage`.

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
pnpm cf:check
pnpm cf:build
```

## Architecture

- `src/app`: App Router server pages, metadata, sitemap and robots policy.
- `src/components/layout`: global utility bar, responsive navigation, search, Lite Mode, footer and Ask G20 launcher.
- `src/components/products`: filterable hubs, detail facts and dedicated mobile comparison.
- `src/components/calculators`: nine deterministic calculator routes. Arithmetic never comes from Ask G20.
- `src/components/ai`: accessible streaming-state demonstration, source chips, labeled answer types and human handoff.
- `src/components/onboarding`: resumable eight-stage application, KYC selection, consent, configured fee, STK states and status tracker.
- `src/components/support`: enquiry, callback, complaint, feedback, fraud and whistleblowing forms.
- `src/components/admin`: role-aware presentation for content, products/rates, applications, payments, support, AI knowledge, branches and settings. Backend authorization remains mandatory.
- `src/lib/services.ts`: typed service contracts backed by mock adapters.
- `src/mocks/fixtures.ts`: development-only records with explicit demo IDs.
- `src/lib/analytics.ts`: typed, development-only analytics adapter. Sensitive fields are prohibited.

## Backend replacement

Keep UI components against the interfaces in `src/types/index.ts`. Replace `MockProductService` and `MockApplicationService` with server or HTTP implementations that return the same models. Do not expose provider credentials, document keys, raw payment payloads or private identifiers to client components.

Production onboarding requires secure HTTP-only sessions, server-side validation, rate limiting, bot-defense hooks such as Turnstile, encrypted file transport, malware scanning, secure object storage, audit events and official payment reconciliation. A timer or client button must never produce authoritative payment success.

## Content and configuration

`src/lib/site-config.ts` is the single provisional brand/contact configuration. `src/mocks/fixtures.ts` contains illustrative products, content and locations. Before launch, supply and approve official channels; membership and KYC rules; effective-dated products; governance content; and final legal policies.

## Cloudflare Workers

The project targets Cloudflare Workers with vinext, the current recommended path for new Next.js-on-Workers applications. `wrangler.jsonc` uses the current project compatibility date, `nodejs_compat` and structured observability. Re-run `wrangler types` whenever bindings are introduced; never hand-write binding interfaces or commit secrets.

Use `.dev.vars` for local secrets and `wrangler secret put` for deployed secrets. OpenNext is intentionally not configured; document it only if a real vinext compatibility blocker is reproduced.

## Demo-state boundaries

- Payment states remain distinct; confirmation does not imply application or membership approval.
- Ask G20 labels general information, estimates and preliminary recommendations and shows source links.
- Application persistence stores ordinary form fields only; KYC file objects never enter `localStorage`.
- No real member balances, statements, transactions or lending decisions are represented.
