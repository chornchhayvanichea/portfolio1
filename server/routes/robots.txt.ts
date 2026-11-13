import { buildRobotsTxt } from "../../shared/utils/sitemap";
import { buildUrl } from "../../shared/utils/seo";

export default eventHandler((event) => {
  setHeader(event, "content-type", "text/plain");
  return buildRobotsTxt(buildUrl("/sitemap.xml"));
});
