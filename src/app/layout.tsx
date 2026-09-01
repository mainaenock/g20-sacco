import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/newsreader";
import "./globals.css";
import "./modern.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AskLauncher } from "@/components/layout/ask-launcher";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "Great 20 Sacco | Your goals. Our shared progress.", template: "%s | Great 20 Sacco" },
  description: siteConfig.description,
  robots: { index: true, follow: true },
  openGraph: {
    title: "Great 20 Sacco | Your goals. Our shared progress.",
    description: siteConfig.description,
    type: "website",
    locale: "en_KE",
    images: [{ url: "/og.png", width: 1731, height: 909, alt: "Great 20 Sacco — Your goals. Our shared progress." }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Great 20 Sacco | Your goals. Our shared progress.",
    description: siteConfig.description,
    images: ["/og.png"],
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f7f5ef" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Header />
        <main id="main-content">{children}</main>
        <Footer />
        <AskLauncher />
      </body>
    </html>
  );
}
