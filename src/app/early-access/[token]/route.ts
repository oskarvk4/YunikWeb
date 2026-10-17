import { NextRequest, NextResponse } from "next/server";
import { createStandaloneAdminClient } from "@/lib/supabase/server";
import {
  EARLY_ACCESS_COOKIE,
  createAccessCookie,
  readLinkToken,
} from "@/lib/early-access";

/**
 * Personal link from the launch email. A valid link for someone still on the
 * early-access list sets the access cookie and lands them in the shop; any
 * other link goes to the coming-soon page.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const comingSoon = new URL("/coming-soon", request.url);

  const id = await readLinkToken(token);
  if (!id) return NextResponse.redirect(comingSoon);

  if (id !== "preview") {
    const { data, error } = await createStandaloneAdminClient()
      .from("early_access_subscribers")
      .select("id")
      .eq("id", id)
      .maybeSingle();
    // Removed from the list (or lookup failed): the link stops working.
    if (error || !data) return NextResponse.redirect(comingSoon);
  }

  // Test-email previews get a day; real subscribers get the full window.
  const cookie = await createAccessCookie(id, id === "preview" ? 1 : undefined);
  const response = NextResponse.redirect(new URL("/shop", request.url));
  response.cookies.set(EARLY_ACCESS_COOKIE, cookie.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: cookie.maxAge,
  });
  return response;
}
