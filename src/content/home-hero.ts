export type HeroAction = {
  label: string;
  href: string;
};

export type HeroSlide = {
  id: string;
  eyebrow: string;
  title: string;
  emphasis: string;
  description: string;
  image: string;
  imageAlt: string;
  imageLabel: string;
  primaryAction: HeroAction;
  secondaryAction: HeroAction;
};

// This content boundary can be replaced by approved admin-managed records later.
export const homeHeroSlides: HeroSlide[] = [
  {
    id: "shared-progress",
    eyebrow: "A modern, human digital branch",
    title: "Your goals.",
    emphasis: "Our shared progress.",
    description: "Explore membership, savings and borrowing guidance in one clear place—built for Kenyan mobile access, transparent choices and support when you need it.",
    image: "/hero/leadership.webp",
    imageAlt: "A cooperative leadership team discussing plans around a table",
    imageLabel: "Leadership shaped around member goals",
    primaryAction: { label: "Join G20", href: "/join" },
    secondaryAction: { label: "Explore products", href: "/borrow" },
  },
  {
    id: "member-voices",
    eyebrow: "Leadership shaped by members",
    title: "Member voices.",
    emphasis: "Leadership that listens.",
    description: "Meet the conversations, perspectives and people that help turn shared priorities into practical direction for the cooperative.",
    image: "/hero/member-event.webp",
    imageAlt: "Members taking part in a community financial education event",
    imageLabel: "Learning and listening in the community",
    primaryAction: { label: "About G20", href: "/about" },
    secondaryAction: { label: "Meet leadership", href: "/about/leadership" },
  },
  {
    id: "clear-support",
    eyebrow: "Human guidance, clearly explained",
    title: "Clear choices.",
    emphasis: "Support that listens.",
    description: "Move from questions to a useful next step with approachable guidance, visible assumptions and a simple path to human support.",
    image: "/hero/member-service.webp",
    imageAlt: "A member and adviser reviewing options together on a tablet",
    imageLabel: "One-to-one guidance for clearer choices",
    primaryAction: { label: "Explore services", href: "/services" },
    secondaryAction: { label: "Ask G20", href: "/ask-g20" },
  },
  {
    id: "enterprise-growth",
    eyebrow: "Opportunity built together",
    title: "Local ideas.",
    emphasis: "Growth we can share.",
    description: "Discover pathways for groups and enterprises to plan, learn and grow with tools designed around practical goals and shared momentum.",
    image: "/hero/enterprise-growth.webp",
    imageAlt: "Entrepreneurs collaborating on products and plans at a workshop",
    imageLabel: "Enterprise ideas taking shape together",
    primaryAction: { label: "Group membership", href: "/membership/group" },
    secondaryAction: { label: "Explore borrowing", href: "/borrow" },
  },
];
