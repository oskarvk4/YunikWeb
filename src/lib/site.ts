/**
 * The site's public address. yunik.dk redirects to www.yunik.dk, so canonical
 * links, the sitemap and structured data use the www address directly.
 */
export const SITE_URL = "https://www.yunik.dk";

/** An absolute URL for a path on the site, or the URL itself if it already is one. */
export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : `${SITE_URL}${pathOrUrl}`;
}
