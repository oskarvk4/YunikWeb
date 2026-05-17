import { NextResponse, type NextRequest } from "next/server";

const COMING_SOON_PATH = "/coming-soon";

const ALLOWED_PREFIXES = [
  COMING_SOON_PATH,
  "/admin",
  "/auth",
  "/api",
  "/_next",
];

const ALLOWED_FILES = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const comingSoonEnabled = process.env.NEXT_PUBLIC_COMING_SOON === "true";

  if (!comingSoonEnabled) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const isAllowedPrefix = ALLOWED_PREFIXES.some((prefix) =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const isAllowedFile = ALLOWED_FILES.has(pathname) || pathname.includes(".");

  if (isAllowedPrefix || isAllowedFile) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const url = request.nextUrl.clone();
  url.pathname = COMING_SOON_PATH;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
