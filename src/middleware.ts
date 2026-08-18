import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const COMING_SOON_PATH = "/coming-soon";

// Routes always visible, whether or not the coming-soon gate is on.
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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  const comingSoonEnabled = process.env.NEXT_PUBLIC_COMING_SOON === "true";

  if (!comingSoonEnabled) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const isAllowedPrefix = ALLOWED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
  // Anything with an extension (`.webp`, `.js`, etc.) is treated as a file.
  const isAllowedFile =
    ALLOWED_FILES.has(pathname) || pathname.includes(".");

  if (isAllowedPrefix || isAllowedFile) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // Authenticated bypass — logged-in users (admins, copy editors) see the
  // real storefront so they can preview edits without exposing the site
  // to the public.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseKey) {
    const response = NextResponse.next({
      request: { headers: requestHeaders },
    });
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      return response;
    }
  }

  const url = request.nextUrl.clone();
  url.pathname = COMING_SOON_PATH;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
