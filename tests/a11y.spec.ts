import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  { name: "Homepage", path: "/" },
  { name: "Search results", path: "/search?q=phoenix" },
  { name: "City landing page", path: "/phoenix-az" },
  { name: "Article page", path: "/articles/choosing-attic-cleaning-company" },
  { name: "Not found page", path: "/this-page-does-not-exist" },
];

for (const { name, path } of pages) {
  test(`${name} (${path}) has no WCAG 2.1 AA violations`, async ({ page }) => {
    await page.goto(path, { waitUntil: "networkidle" });

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();

    const violations = results.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      nodes: v.nodes.length,
    }));

    expect(violations, `Accessibility violations on ${name}`).toEqual([]);
  });
}

test("Listing detail page has no WCAG 2.1 AA violations", async ({ page }) => {
  // Navigate to city page and discover a valid listing link
  await page.goto("/phoenix-az", { waitUntil: "networkidle" });
  const listingLink = page.locator("article a[href*='/phoenix-az/']").first();
  const href = await listingLink.getAttribute("href");
  expect(href, "No listing links found on /phoenix-az").toBeTruthy();

  await page.goto(href!, { waitUntil: "networkidle" });

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const violations = results.violations.map((v) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes.length,
  }));

  expect(violations, "Accessibility violations on listing detail page").toEqual(
    []
  );
});
