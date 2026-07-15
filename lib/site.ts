/** Canonical public origin for docs (sitemap, robots, llms.txt). */
export const SITE_URL = "https://docs.mediflux.in";

/** Absolute URL for a docs page's Markdown endpoint (`/docs/....md`). */
export function absoluteDocsMarkdownUrl(
  docsPathname: string,
  origin?: string
): string {
  const path = docsPathname.endsWith(".md") ? docsPathname : `${docsPathname}.md`;
  return new URL(path, origin ?? SITE_URL).toString();
}
