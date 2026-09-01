import { expect, test } from "@playwright/test";

test("homepage leads to deterministic loan calculator", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Your goals/i })).toBeVisible();
  await page.getByRole("link", { name: /open full calculator/i }).click();
  await expect(page.getByText(/estimated monthly repayment/i)).toBeVisible();
});

test("membership journey begins and persists the selected path", async ({ page }) => {
  await page.goto("/join");
  await page.getByLabel("Individual").check();
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await expect(page.getByText("Step 2 of 8")).toBeVisible();
  await page.reload();
  await expect(page.getByText("Step 2 of 8")).toBeVisible();
});

test("Ask G20 returns source-linked guidance", async ({ page }) => {
  await page.goto("/ask-g20");
  await expect(page.locator(".chat-shell")).toHaveAttribute("data-ready", "true");
  await page.getByPlaceholder(/ask about membership/i).fill("How do I join?");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText(/registration payment/i)).toBeVisible({ timeout: 5000 });
  await expect(page.getByRole("link", { name: /Based on: How membership works/i })).toBeVisible();
});

test("header search reveals results inline without a modal", async ({ page }) => {
  await page.goto("/");
  const search = page.getByPlaceholder(/search membership, products/i);
  await expect(search).toBeVisible();
  await search.fill("loan");
  await expect(page.getByRole("link", { name: /Loan calculators/i })).toBeVisible();
  await expect(page.locator(".search-backdrop")).toHaveCount(0);
});
