import { describe, expect, it } from "vitest";
import { buildUrl } from "#shared/utils/seo";
import {
  buildRobotsTxt,
  buildSitemapLocs,
  buildSitemapXml,
} from "#shared/utils/sitemap";

describe("buildSitemapLocs", () => {
  it("assembles static and project routes into absolute sitemap URLs", () => {
    const locs = buildSitemapLocs(
      ["/", "/about", "/contact"],
      [
        "/projects/laundry-management-system",
        "/projects/portfolio-site",
      ],
    );

    expect(locs).toEqual([
      buildUrl("/"),
      buildUrl("/about"),
      buildUrl("/contact"),
      buildUrl("/projects/laundry-management-system"),
      buildUrl("/projects/portfolio-site"),
    ]);

    const xml = buildSitemapXml(locs);
    expect(xml.match(/<loc>/g)).toHaveLength(5);
    for (const loc of locs) {
      expect(xml).toContain(`<loc>${loc}</loc>`);
    }
  });
});

describe("buildSitemapXml", () => {
  it("emits one loc per URL inside a valid urlset", () => {
    const xml = buildSitemapXml([buildUrl("/"), buildUrl("/projects/x")]);
    expect(xml).toContain("<?xml");
    expect(xml).toContain(
      'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    );
    expect(xml).toContain(`<loc>${buildUrl("/")}</loc>`);
    expect(xml).toContain(`<loc>${buildUrl("/projects/x")}</loc>`);
    expect(xml).toContain("</urlset>");
  });
});

describe("buildRobotsTxt", () => {
  it("references the sitemap cleanly", () => {
    expect(buildRobotsTxt(buildUrl("/sitemap.xml"))).toBe(
      `User-agent: *\nAllow: /\n\nSitemap: ${buildUrl("/sitemap.xml")}\n`,
    );
  });
});
