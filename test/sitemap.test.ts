import { describe, expect, it } from "vitest";
import { buildRobotsTxt, buildSitemapXml } from "#shared/utils/sitemap";

describe("buildSitemapXml", () => {
  it("emits one loc per URL inside a valid urlset", () => {
    const xml = buildSitemapXml([
      "https://example.com/",
      "https://example.com/projects/x",
    ]);
    expect(xml).toContain("<?xml");
    expect(xml).toContain(
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    );
    expect(xml).toContain("<loc>https://example.com/</loc>");
    expect(xml).toContain("<loc>https://example.com/projects/x</loc>");
    expect(xml).toContain("</urlset>");
  });
});

describe("buildRobotsTxt", () => {
  it("references the sitemap cleanly", () => {
    expect(buildRobotsTxt("https://example.com/sitemap.xml")).toBe(
      "User-agent: *\nAllow: /\n\nSitemap: https://example.com/sitemap.xml\n",
    );
  });
});
