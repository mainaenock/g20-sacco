import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, CircleHelp, HandCoins, PiggyBank, ShieldCheck, Sparkles, Users, WalletCards } from "lucide-react";
import { Container, DemoNotice, SectionHeader, ButtonLink } from "@/components/ui/primitives";
import { ProductCard } from "@/components/products/product-card";
import { QuickCalculator } from "@/components/calculators/quick-calculator";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { homeHeroSlides } from "@/content/home-hero";
import { contentItems, products } from "@/mocks/fixtures";
import { formatDate } from "@/lib/format";

const goals = [
  { label: "Save with purpose", href: "/save", icon: PiggyBank },
  { label: "Explore borrowing", href: "/borrow", icon: HandCoins },
  { label: "Join G20", href: "/join", icon: Users },
  { label: "Grow a group or business", href: "/membership/group", icon: BriefcaseBusiness },
  { label: "Find a service", href: "/services", icon: WalletCards },
  { label: "Understand my options", href: "/ask-g20", icon: CircleHelp },
];

const journey = [
  { title: "Choose your path", body: "Understand the available membership routes and the documents each one may require." },
  { title: "Complete your details", body: "Move through a clear mobile form with progress, validation and safe save states." },
  { title: "Provide documents", body: "Use the tap-friendly KYC checklist and retry an upload without losing the rest of your form." },
  { title: "Track the review", body: "Payment confirmation and membership approval remain separate, visible statuses." },
];

export default function HomePage() {
  return (
    <>
      <HeroCarousel slides={homeHeroSlides} />

      <section className="section section--soft">
        <Container>
          <DemoNotice />
          <SectionHeader eyebrow="Start with your goal" title="What would you like to do today?" description="Skip the product jargon. Choose the outcome that matters to you and we’ll guide the next step." />
          <div className="goal-grid">
            {goals.map(({ label, href, icon: Icon }) => <Link className="goal-card" href={href} key={href}><Icon aria-hidden="true" /><strong>{label}<ArrowRight size={17} /></strong></Link>)}
          </div>
        </Container>
      </section>

      <section className="section section--products">
        <Container>
          <SectionHeader eyebrow="Explore possibilities" title="Products explained in plain language." description="Each demonstration card carries effective-date context, method-aware rates and the conditions a real configuration must supply." action={<Link href="/compare" className="button button--secondary">Compare options</Link>} />
          <p className="card-rail__hint" id="product-rail-hint">Swipe sideways to explore all products</p>
          <div className="card-grid card-grid--four card-rail" role="region" aria-label="G20 products" aria-describedby="product-rail-hint" tabIndex={0}>{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </Container>
      </section>

      <section className="section section--soft"><Container><QuickCalculator /></Container></section>

      <section className="section">
        <Container>
          <SectionHeader eyebrow="A process you can see" title="Membership, step by step." description="Your registration fee, payment status, application review and final decision are kept deliberately distinct." />
          <div className="steps">{journey.map((step) => <article className="step-card" key={step.title}><h3>{step.title}</h3><p>{step.body}</p></article>)}</div>
          <div style={{ marginTop: 32 }}><ButtonLink href="/membership/how-it-works" variant="secondary">See the full journey</ButtonLink></div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <p className="home-duo__hint" id="home-duo-hint">Swipe sideways to explore both guides</p>
          <div className="home-duo" role="region" aria-label="Guidance and security highlights" aria-describedby="home-duo-hint" tabIndex={0}>
            <article className="home-duo__panel home-duo__panel--dark">
              <Sparkles aria-hidden="true" />
              <p className="eyebrow">Ask G20</p>
              <h2>One clear answer.<br />One useful next step.</h2>
              <p>Ask in plain language, see where the guidance came from, then move to a calculator or a person when that is more useful.</p>
              <ButtonLink href="/ask-g20" variant="gold">Ask G20</ButtonLink>
            </article>
            <article className="home-duo__panel home-duo__panel--gold">
              <ShieldCheck aria-hidden="true" />
              <p className="eyebrow">Security first</p>
              <h2>Pause before you pay or share.</h2>
              <p>Never share your M-Pesa PIN, password or one-time code. Payment confirmation and membership approval are always separate.</p>
              <ButtonLink href="/security" variant="secondary">Security guidance</ButtonLink>
            </article>
          </div>
        </Container>
      </section>

      <section className="section">
        <Container>
          <SectionHeader eyebrow="Learn before you decide" title="Practical financial education." description="Clear guides connect what you learn to calculators and the next useful action." action={<ButtonLink href="/learn" variant="secondary">Browse all guides</ButtonLink>} />
          <div className="card-grid card-grid--three">
            {contentItems.map((item) => <article className="content-card" key={item.id}><span className="badge badge--info">{item.category}</span><h3 style={{ marginTop: 22 }}>{item.title}</h3><p>{item.summary}</p><small>{formatDate(item.publishedAt)}{item.readingMinutes ? ` · ${item.readingMinutes} min read` : ""}</small><Link className="product-card__link" href={`/learn/${item.slug}`}>Read guide <ArrowRight size={17} /></Link></article>)}
          </div>
        </Container>
      </section>

      <section className="section section--soft">
        <Container>
          <div className="closing-panel">
            <div><p className="eyebrow">Ready when you are</p><h2>Start your membership journey with clarity.</h2><p>Complete a fully reviewable demonstration application, including KYC, consent, configured fee, mocked M-Pesa states and tracking.</p></div>
            <div style={{ display: "grid", alignContent: "center", gap: 10 }}><ButtonLink href="/join" variant="gold">Start application</ButtonLink><ButtonLink href="/application-status" variant="secondary">Track an application</ButtonLink></div>
          </div>
        </Container>
      </section>
    </>
  );
}
