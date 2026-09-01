import { Container, ButtonLink } from "@/components/ui/primitives";

export default function NotFound() { return <section className="section"><Container><div className="state-card"><p className="eyebrow">404</p><h1 style={{ fontSize: "clamp(2rem, 6vw, 4rem)" }}>This page could not be found.</h1><p>Try the help centre, search or return to the digital branch home.</p><ButtonLink href="/">Return home</ButtonLink></div></Container></section>; }
