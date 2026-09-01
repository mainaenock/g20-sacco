import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/primitives";
import { PageHero } from "@/components/content/page-chrome";
import { GenericPage, getCollectionDefinition, getDefinition } from "@/components/content/generic-page";
import { ProductHub } from "@/components/products/product-hub";
import { ProductDetail } from "@/components/products/product-detail";
import { Comparison } from "@/components/products/comparison";
import { CalculatorCentre, calculatorDefinitions } from "@/components/calculators/calculator-centre";
import { CalculatorPage } from "@/components/calculators/calculator-page";
import { AskG20 } from "@/components/ai/ask-g20";
import { JoinApplication } from "@/components/onboarding/join-application";
import { ApplicationStatus } from "@/components/onboarding/application-status";
import { SupportForm } from "@/components/support/support-form";
import { BranchLocator } from "@/components/branches/branch-locator";
import { AdminConsole } from "@/components/admin/admin-console";
import { ArticlePage } from "@/components/content/article-page";
import { productService } from "@/lib/services";
import { contentItems, products } from "@/mocks/fixtures";
import { routeLabels } from "@/lib/site-config";

type Props = { params: Promise<{ slug: string[] }> };

const allowedRoots = new Set(["membership", "join", "application-status", "save", "borrow", "compare", "calculators", "ask-g20", "services", "learn", "blog", "news", "events", "notices", "media", "stories", "transparency", "reports", "downloads", "branches", "security", "about", "careers", "procurement", "partners", "help", "contact", "request-callback", "complaints", "feedback", "report-fraud", "whistleblowing", "privacy", "terms", "cookies", "accessibility", "admin"]);

function defaultTitle(path: string[]) {
  const last = path.at(-1) ?? "G20";
  return routeLabels[last] ?? last.split("-").map((word) => word[0]?.toUpperCase() + word.slice(1)).join(" ");
}

function pageCopy(path: string[]) {
  const route = path.join("/");
  const definition = getDefinition(route);
  if (definition) return { eyebrow: definition.eyebrow, title: definition.title, description: definition.description };
  if ((path[0] === "save" || path[0] === "borrow") && path[1]) {
    const product = products.find((item) => item.slug === path[1]);
    if (product) return { eyebrow: product.kind === "loan" ? "Borrow" : "Save", title: product.name, description: product.summary };
  }
  if (pathIsArticle(path)) {
    const item = contentItems.find((content) => content.slug === path[1]) ?? contentItems[0];
    return { eyebrow: `${item.category} guide`, title: item.title, description: item.summary };
  }
  const collection = getCollectionDefinition(route);
  if (collection) return { eyebrow: collection.category, title: collection.title, description: collection.description };
  if (route === "join") return { eyebrow: "Digital membership application", title: "Join G20, one clear step at a time.", description: "Complete a resumable demonstration journey through contact verification, details, KYC, consent, configured fee, M-Pesa states and tracking." };
  if (route === "application-status") return { eyebrow: "Application tracking", title: "Check progress without exposing private details.", description: "Verify a demonstration reference and second factor before viewing separate payment and application states." };
  if (route === "save") return { eyebrow: "Save", title: "Build a saving path around your goal.", description: "Filter demonstration savings options by audience and purpose, then open transparent assumptions and planning tools." };
  if (route === "borrow") return { eyebrow: "Borrow", title: "What do you need financing for?", description: "Begin with your goal, compare method-aware demonstration products and estimate the full cost before making an enquiry." };
  if (route === "compare") return { eyebrow: "Product comparison", title: "Differences you can actually see.", description: "Compare two to four products in a dedicated mobile layout without declaring a universal best option." };
  if (route === "calculators") return { eyebrow: "Financial calculator centre", title: "Plan with the assumptions in plain sight.", description: "Every number comes from deterministic local logic and clearly marked demonstration rules—not an AI model." };
  if (path[0] === "calculators") { const calc = calculatorDefinitions.find((item) => item.slug === path[1]); return { eyebrow: "Deterministic estimate", title: calc?.title ?? "Financial calculator", description: calc?.description ?? "Adjust assumptions and understand the result." }; }
  if (route === "ask-g20") return { eyebrow: "Guided help", title: "Ask in your own words.", description: "Find information, open deterministic tools, view source links or hand off to human support." };
  if (route === "branches") return { eyebrow: "Service points", title: "Find the right place to get help.", description: "Search a complete accessible list even when a map provider or verified coordinates are unavailable." };
  if (path[0] === "admin") return { eyebrow: "Website administration", title: "Operate the public digital branch.", description: "Review content, products, rates, applications, payments, support and AI knowledge using safe demonstration records." };
  if (["contact", "request-callback", "complaints", "feedback", "report-fraud", "whistleblowing"].includes(path[0])) return { eyebrow: "Support", title: defaultTitle(path), description: "A structured, accessible support journey with clear privacy and status language." };
  return { eyebrow: "G20 digital branch", title: defaultTitle(path), description: "Clear, reviewable information with explicit approval and verification states." };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const copy = pageCopy(slug);
  const isDetail = pathIsArticle(slug) || ((slug[0] === "save" || slug[0] === "borrow") && slug.length > 1);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: `/${slug.join("/")}` },
    ...(isDetail ? {
      openGraph: { title: copy.title, description: copy.description, images: [] },
      twitter: { title: copy.title, description: copy.description, images: [] },
    } : {}),
  };
}

export default async function CatchAllPage({ params }: Props) {
  const { slug } = await params;
  if (!slug.length || !allowedRoots.has(slug[0])) notFound();
  const route = slug.join("/");
  const copy = pageCopy(slug);
  let content: React.ReactNode;

  if (route === "join") content = <JoinApplication />;
  else if (route === "application-status") content = <ApplicationStatus />;
  else if (route === "save") content = <ProductHub kind="savings" />;
  else if (route === "borrow") content = <ProductHub kind="loan" />;
  else if ((slug[0] === "save" || slug[0] === "borrow") && slug[1]) {
    const product = await productService.get(slug[1]);
    content = product ? <ProductDetail product={product} /> : <GenericPage route={route} />;
  } else if (route === "compare") content = <Comparison products={products} />;
  else if (route === "calculators") content = <CalculatorCentre />;
  else if (slug[0] === "calculators" && calculatorDefinitions.some((item) => item.slug === slug[1])) content = <CalculatorPage slug={slug[1] as Parameters<typeof CalculatorPage>[0]["slug"]} />;
  else if (route === "ask-g20") content = <AskG20 />;
  else if (route === "branches") content = <BranchLocator />;
  else if (pathIsArticle(slug)) content = <ArticlePage slug={slug[1]} />;
  else if (slug[0] === "admin") content = <AdminConsole initial={slug[1] ?? "dashboard"} />;
  else if (["contact", "request-callback", "complaints", "feedback", "report-fraud", "whistleblowing"].includes(slug[0])) {
    const typeMap = { contact: "contact", "request-callback": "callback", complaints: "complaint", feedback: "feedback", "report-fraud": "fraud", whistleblowing: "whistleblowing" } as const;
    content = <SupportForm type={typeMap[slug[0] as keyof typeof typeMap]} />;
  } else content = <GenericPage route={route} />;

  return <><PageHero path={slug} {...copy} /><section className="section"><Container>{content}</Container></section></>;
}

function pathIsArticle(path: string[]) { return ["learn", "blog", "news"].includes(path[0]) && path.length > 1; }
