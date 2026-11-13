import { buildSitemapXml } from "../../shared/utils/sitemap";
import { buildUrl } from "../../shared/utils/seo";

const staticPaths = ["/", "/about", "/contact"];

export default eventHandler(async (event) => {
  const projects = await queryCollection(event, "projects")
    .select("path")
    .all();
  const locs = [...staticPaths, ...projects.map((p) => p.path)].map(buildUrl);
  setHeader(event, "content-type", "application/xml");
  return buildSitemapXml(locs);
});
