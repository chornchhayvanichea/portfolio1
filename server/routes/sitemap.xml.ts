import {
  buildSitemapLocs,
  buildSitemapXml,
} from "../../shared/utils/sitemap";

const staticPaths = ["/", "/about", "/contact"];

export default eventHandler(async (event) => {
  const projects = await queryCollection(event, "projects")
    .select("path")
    .all();
  const locs = buildSitemapLocs(
    staticPaths,
    projects.map((p) => p.path),
  );
  setHeader(event, "content-type", "application/xml");
  return buildSitemapXml(locs);
});
