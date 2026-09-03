import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HeroCarousel } from "./hero-carousel";
import { homeHeroSlides } from "@/content/home-hero";

describe("HeroCarousel", () => {
  it("keeps each image and its matching copy in sync when navigating", () => {
    render(<HeroCarousel slides={homeHeroSlides} />);

    expect(screen.getByRole("heading", { level: 1, name: /Your goals.*Our shared progress/i })).toBeInTheDocument();
    expect(screen.getByAltText("A cooperative leadership team discussing plans around a table")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Show next hero slide" }));

    expect(screen.getByRole("heading", { level: 1, name: /Member voices.*Leadership that listens/i })).toBeInTheDocument();
    expect(screen.getByAltText("Members taking part in a community financial education event")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Resume hero slides" })).toBeInTheDocument();
  });
});
