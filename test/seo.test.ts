import { describe, expect, it } from "vitest";
import { site } from "#shared/site.config";
import {
  buildUrl,
  pageSeo,
  personJsonLd,
  softwareJsonLd,
} from "#shared/utils/seo";

describe("site.config", () => {
  it("holds the pinned identity values", () => {
    expect(site.name).toBe("Chorn Chhayvanichea");
    expect(site.email).toBe("chornchhayvanichea@gmail.com");
    expect(site.github).toBe("https://github.com/chornchhayvanichea");
    expect(site.url).toMatch(/^https:\/\/.+/); // placeholder until a domain is deployed
    expect(site.jobTitle).toBe("Junior Full-Stack Software Developer");
    expect(site.location).toBe("Cambodia · Open to remote");
    expect(site.resumeUrl).toBeNull();
  });
});

describe("buildUrl", () => {
  it("joins the configured domain with the path", () => {
    const base = site.url.replace(/\/+$/, "");
    expect(buildUrl("/")).toBe(`${base}/`);
    expect(buildUrl("/projects/laundry-management-system")).toBe(
      `${base}/projects/laundry-management-system`,
    );
  });
});

describe("pageSeo", () => {
  const seo = pageSeo({
    title: "About",
    description: "About Chorn",
    path: "/about",
  });

  it("builds a unique title, description, canonical, and OG/Twitter tags", () => {
    expect(seo.title).toBe("About — Chorn Chhayvanichea");
    expect(seo.meta).toContainEqual({
      name: "description",
      content: "About Chorn",
    });
    expect(seo.link).toContainEqual({
      rel: "canonical",
      href: buildUrl("/about"),
    });
    expect(seo.meta).toContainEqual({
      property: "og:title",
      content: "About — Chorn Chhayvanichea",
    });
    expect(seo.meta).toContainEqual({
      property: "og:type",
      content: "website",
    });
    expect(seo.meta).toContainEqual({
      property: "og:url",
      content: buildUrl("/about"),
    });
    expect(seo.meta).toContainEqual({
      name: "twitter:card",
      content: "summary",
    });
  });

  it("honors ogType override", () => {
    expect(
      pageSeo({ title: "X", description: "Y", path: "/p", ogType: "article" })
        .meta,
    ).toContainEqual({ property: "og:type", content: "article" });
  });
});

describe("personJsonLd", () => {
  it("contains only truthful, configured fields", () => {
    expect(personJsonLd()).toEqual({
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Chorn Chhayvanichea",
      email: "mailto:chornchhayvanichea@gmail.com",
      url: buildUrl("/"),
      jobTitle: "Junior Full-Stack Software Developer",
      address: { "@type": "PostalAddress", addressCountry: "KH" },
      sameAs: ["https://github.com/chornchhayvanichea"],
    });
  });
});

describe("softwareJsonLd", () => {
  it("builds SoftwareSourceCode with author, omitting codeRepository when unset", () => {
    const ld = softwareJsonLd({
      name: "P",
      description: "D",
      programmingLanguage: ["Go"],
    });
    expect(ld["@type"]).toBe("SoftwareSourceCode");
    expect(ld.author).toEqual({
      "@type": "Person",
      name: site.name,
      url: buildUrl("/"),
    });
    expect(ld).not.toHaveProperty("codeRepository");
    const withRepo = softwareJsonLd({
      name: "P",
      description: "D",
      programmingLanguage: ["Go"],
      codeRepository: "https://github.com/x/y",
    });
    expect(withRepo.codeRepository).toBe("https://github.com/x/y");
  });
});
