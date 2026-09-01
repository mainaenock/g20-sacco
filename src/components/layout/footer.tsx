import Link from "next/link";
import { Brand } from "@/components/ui/brand";
import { Container } from "@/components/ui/primitives";

const groups = [
  { title: "Explore", links: [["Membership", "/membership"], ["Savings", "/save"], ["Loans", "/borrow"], ["Calculators", "/calculators"]] },
  { title: "Get help", links: [["Help centre", "/help"], ["Contact", "/contact"], ["Complaints", "/complaints"], ["Report fraud", "/report-fraud"]] },
  { title: "Trust", links: [["Security", "/security"], ["Transparency", "/transparency"], ["Privacy", "/privacy"], ["Accessibility", "/accessibility"]] },
  { title: "Organisation", links: [["About", "/about"], ["Careers", "/careers"], ["Procurement", "/procurement"], ["Branches", "/branches"]] },
];

export function Footer() {
  return (
    <footer className="site-footer">
      <Container>
        <div className="footer-lead">
          <div><Brand /><p>A clear, human digital branch built for mobile access and informed financial decisions.</p></div>
          <form className="newsletter"><label htmlFor="newsletter-email">Useful updates, without the noise</label><div><input id="newsletter-email" type="email" inputMode="email" autoComplete="email" placeholder="Email address" /><button type="submit">Subscribe</button></div><small>By subscribing, you agree to receive G20 updates. Consent can be withdrawn at any time.</small></form>
        </div>
        <div className="footer-grid">
          {groups.map((group) => <nav key={group.title} aria-label={group.title}><h2>{group.title}</h2>{group.links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</nav>)}
        </div>
        <div className="footer-bottom"><p>© {new Date().getFullYear()} Great 20 Sacco. Frontend demonstration.</p><p>Official regulator, payment and contact details appear only after verification.</p></div>
      </Container>
    </footer>
  );
}
