export const DOCS_HOME_PATH = "/docs/introduction";

/** Map `/` to the docs home page for nav, search, and AI context. */
export function resolveDocsPathname(pathname: string): string {
  if (pathname === "/") return DOCS_HOME_PATH;
  return pathname;
}

export function isDocsPathname(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/docs");
}
