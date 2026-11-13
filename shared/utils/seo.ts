import { site } from "../site.config";

export function buildUrl(path: string): string {
  const base = site.url.replace(/\/+$/, "");
  const normalized = `/${path.replace(/^\/+/, "")}`;
  return `${base}${normalized}`;
}

export function pageSeo(input: {
  title: string;
  description: string;
  path: string;
  ogType?: "website" | "article";
  suffix?: boolean;
}): {
  title: string;
  meta: Array<{ name?: string; property?: string; content: string }>;
  link: Array<{ rel: string; href: string }>;
} {
  const title =
    input.suffix === false ? input.title : `${input.title} — ${site.name}`;
  const url = buildUrl(input.path);
  const ogType = input.ogType ?? "website";

  return {
    title,
    meta: [
      { name: "description", content: input.description },
      { property: "og:title", content: title },
      { property: "og:description", content: input.description },
      { property: "og:type", content: ogType },
      { property: "og:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: input.description },
      { name: "twitter:card", content: "summary" },
    ],
    link: [{ rel: "canonical", href: url }],
  };
}

export function personJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    email: `mailto:${site.email}`,
    url: buildUrl("/"),
    jobTitle: site.jobTitle,
    address: { "@type": "PostalAddress", addressCountry: "KH" },
    sameAs: [site.github],
  };
}

export function softwareJsonLd(p: {
  name: string;
  description: string;
  programmingLanguage: string[];
  codeRepository?: string;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: p.name,
    description: p.description,
    programmingLanguage: p.programmingLanguage,
    author: { "@type": "Person", name: site.name, url: buildUrl("/") },
    ...(p.codeRepository ? { codeRepository: p.codeRepository } : {}),
  };
}
