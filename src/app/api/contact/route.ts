import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  honeypot?: string;
};

const SUBJECT_LABELS: Record<string, string> = {
  order: "Sporgsmal om ordre",
  product: "Sporgsmal om produkt",
  return: "Returnering/bytte",
  other: "Andet",
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, honeypot } =
      (await request.json()) as ContactPayload;

    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Alle felter skal udfyldes" },
        { status: 400 }
      );
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const to =
      process.env.CONTACT_EMAIL ||
      process.env.REPLY_TO_EMAIL ||
      "YunikJewelry@outlook.com";

    if (!resendApiKey) {
      return NextResponse.json(
        { error: "Kontaktformularen er ikke konfigureret endnu" },
        { status: 503 }
      );
    }

    const resend = new Resend(resendApiKey);
    const from = process.env.EMAIL_FROM || "Yunik <kontakt@yunik.dk>";
    const subjectLabel = SUBJECT_LABELS[subject] || SUBJECT_LABELS.other;

    const html = `
      <h2>Ny kontaktformular-besked</h2>
      <p><strong>Navn:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Emne:</strong> ${escapeHtml(subjectLabel)}</p>
      <p><strong>Besked:</strong></p>
      <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
    `;

    const result = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Kontaktformular: ${subjectLabel}`,
      html,
      text: `Navn: ${name}\nEmail: ${email}\nEmne: ${subjectLabel}\n\n${message}`,
    });

    if (result.error) {
      console.error("Contact form email failed:", result.error);
      return NextResponse.json(
        { error: "Beskeden kunne ikke sendes" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact route failed:", error);
    return NextResponse.json(
      { error: "Der opstod en fejl ved afsendelse" },
      { status: 500 }
    );
  }
}
