import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createStandaloneAdminClient } from "@/lib/supabase/server";
import EarlyAccessConfirmation from "@/emails/EarlyAccessConfirmation";

type EarlyAccessPayload = {
  email?: string;
  honeypot?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// This endpoint is unauthenticated and triggers an outbound email, so a light
// per-IP throttle keeps it from being used as a mail cannon. In-memory only —
// it resets per serverless instance, which is fine for the abuse it stops.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const recentRequests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const hits = (recentRequests.get(ip) ?? []).filter((t) => t > cutoff);

  if (hits.length >= RATE_LIMIT_MAX) {
    recentRequests.set(ip, hits);
    return true;
  }

  hits.push(now);
  recentRequests.set(ip, hits);

  // Opportunistic cleanup so the map can't grow unbounded.
  if (recentRequests.size > 5000) {
    for (const [key, times] of recentRequests) {
      if (times.every((t) => t <= cutoff)) recentRequests.delete(key);
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const { email, honeypot } = (await request.json()) as EarlyAccessPayload;

    // Bots fill the hidden field. Return the same shape a human gets so they
    // learn nothing from the response.
    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    const normalizedEmail = email?.trim().toLowerCase() || "";

    if (!normalizedEmail || !EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Indtast en gyldig emailadresse" },
        { status: 400 }
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Prøv igen om lidt." },
        { status: 429 }
      );
    }

    const supabase = createStandaloneAdminClient();
    const { error: insertError } = await supabase
      .from("early_access_subscribers")
      .insert({ email: normalizedEmail, source: "coming-soon" });

    // 23505 = unique violation: already on the list. Treat as success, but skip
    // the confirmation so re-submitting an address can't spam its owner.
    const alreadySubscribed = insertError?.code === "23505";

    if (insertError && !alreadySubscribed) {
      console.error("Early access insert failed:", insertError);
      return NextResponse.json(
        { error: "Tilmeldingen kunne ikke gemmes. Prøv igen." },
        { status: 500 }
      );
    }

    if (!alreadySubscribed) {
      const resendApiKey = process.env.RESEND_API_KEY;

      if (resendApiKey) {
        const contactEmail =
          process.env.REPLY_TO_EMAIL ||
          process.env.CONTACT_EMAIL ||
          "kontakt@yunik.dk";

        const confirmation = await new Resend(resendApiKey).emails.send({
          from: process.env.EMAIL_FROM || "Yunik <kontakt@yunik.dk>",
          to: normalizedEmail,
          replyTo: contactEmail,
          subject: "Du er på listen hos Yunik",
          react: EarlyAccessConfirmation({ contactEmail }),
          text:
            `Du er på listen.\n\n` +
            `Tak fordi du vil være blandt de første. Vi giver dig besked, inden kollektionen åbner for alle andre.\n\n` +
            `Har du spørgsmål i mellemtiden, kan du svare direkte på denne mail eller skrive til ${contactEmail}.\n\n` +
            `Venlig hilsen\nYunik`,
        });

        // The signup is already saved — a failed confirmation is worth logging
        // but not worth telling the visitor their signup didn't work.
        if (confirmation.error) {
          console.error(
            "Early access confirmation email failed:",
            confirmation.error
          );
        }
      } else {
        console.warn(
          "RESEND_API_KEY not configured — skipping early access confirmation"
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Early access route failed:", error);
    return NextResponse.json(
      { error: "Der opstod en fejl. Prøv igen." },
      { status: 500 }
    );
  }
}
