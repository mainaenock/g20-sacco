import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProductCard } from "./product-card";
import { products } from "@/mocks/fixtures";

describe("ProductCard", () => {
  it("shows demo context and a product link", () => {
    render(<ProductCard product={products[0]} />);
    expect(screen.getByText("Demo")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explore details/i })).toHaveAttribute("href", `/borrow/${products[0].slug}`);
  });
});
