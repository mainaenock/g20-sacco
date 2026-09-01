"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export function AskLauncher() {
  const pathname = usePathname();
  if (pathname === "/join" || pathname === "/ask-g20" || pathname.startsWith("/admin")) return null;
  return <Link href="/ask-g20" className="ask-launcher" aria-label="Open Ask G20 assistant"><Sparkles aria-hidden="true" /><span>Ask G20</span></Link>;
}
