import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import ContactConfirmation from "@/emails/ContactConfirmation";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  honeypot?: string;
};

const SUBJECT_LABELS: Record<string, string> = {
  order: "Spørgsmål om ordre",
  product: "Spørgsmål om produkt",
  return: "Returnering/bytte",
  other: "Andet",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeLineBreaks(value: string): string {
  return value.replaceAll("\r\n", "\n").trim();
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, honeypot } =
      (await request.json()) as ContactPayload;

    const normalizedName = name?.trim() || "";
    const normalizedEmail = email?.trim().toLowerCase() || "";
    const normalizedSubject = subject?.trim() || "";
    const normalizedMessage = normalizeLineBreaks(message || "");

    if (honeypot) {
      return NextResponse.json({ ok: true });
    }

    if (
      !normalizedName ||
      !normalizedEmail ||
      !normalizedSubject ||
      !normalizedMessage
    ) {
      return NextResponse.json(
        { error: "Alle felter skal udfyldes" },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Indtast en gyldig emailadresse" },
        { status: 400 }
      );
    }

    if (normalizedName.length < 2 || normalizedMessage.length < 10) {
      return NextResponse.json(
        { error: "Beskeden ser ufuldstændig ud. Udfyld lidt mere information." },
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
    const subjectLabel =
      SUBJECT_LABELS[normalizedSubject] || SUBJECT_LABELS.other;
    const submittedAt = new Date().toISOString();
    const preview = normalizedMessage.slice(0, 140);

    const html = `
      <div style="background:#f5f0eb;padding:32px 20px;font-family:Arial,sans-serif;color:#1A1A1A;">
        <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid rgba(26,26,26,0.08);">
          <div style="padding:24px 28px;border-bottom:1px solid rgba(26,26,26,0.08);">
            <div style="font-size:12px;letter-spacing:0.24em;text-transform:uppercase;color:#8D6553;margin-bottom:10px;">Yunik Kontaktformular</div>
            <h1 style="margin:0;font-size:28px;line-height:1.2;font-weight:600;font-family:Georgia,serif;">Ny henvendelse fra websitet</h1>
            <p style="margin:12px 0 0;color:rgba(26,26,26,0.65);font-size:14px;line-height:1.6;">En kunde har sendt en ny besked via kontaktformularen.</p>
          </div>

          <div style="padding:28px;">
            <table role="presentation" style="width:100%;border-collapse:collapse;margin-bottom:24px;">
              <tr>
                <td style="padding:0 0 14px;width:120px;font-size:13px;color:rgba(26,26,26,0.55);vertical-align:top;">Navn</td>
                <td style="padding:0 0 14px;font-size:15px;">${escapeHtml(normalizedName)}</td>
              </tr>
              <tr>
                <td style="padding:0 0 14px;width:120px;font-size:13px;color:rgba(26,26,26,0.55);vertical-align:top;">Email</td>
                <td style="padding:0 0 14px;font-size:15px;"><a href="mailto:${escapeHtml(normalizedEmail)}" style="color:#8D6553;text-decoration:none;">${escapeHtml(normalizedEmail)}</a></td>
              </tr>
              <tr>
                <td style="padding:0 0 14px;width:120px;font-size:13px;color:rgba(26,26,26,0.55);vertical-align:top;">Emne</td>
                <td style="padding:0 0 14px;font-size:15px;">${escapeHtml(subjectLabel)}</td>
              </tr>
              <tr>
                <td style="padding:0;width:120px;font-size:13px;color:rgba(26,26,26,0.55);vertical-align:top;">Modtaget</td>
                <td style="padding:0;font-size:15px;">${escapeHtml(submittedAt)}</td>
              </tr>
            </table>

            <div style="border:1px solid rgba(26,26,26,0.1);background:#faf8f6;padding:18px 20px;">
              <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#8D6553;margin-bottom:12px;">Besked</div>
              <p style="margin:0;font-size:15px;line-height:1.75;white-space:pre-wrap;">${escapeHtml(normalizedMessage).replaceAll("\n", "<br />")}</p>
            </div>
          </div>
        </div>
      </div>
    `;

    const inboxResult = await resend.emails.send({
      from,
      to,
      replyTo: normalizedEmail,
      subject: `Yunik kontaktformular: ${subjectLabel} - ${normalizedName}`,
      html,
      text:
        `YUNIK KONTAKTFORMULAR\n\n` +
        `Navn: ${normalizedName}\n` +
        `Email: ${normalizedEmail}\n` +
        `Emne: ${subjectLabel}\n` +
        `Modtaget: ${submittedAt}\n\n` +
        `Besked:\n${normalizedMessage}\n\n` +
        `Preview: ${preview}`,
    });

    if (inboxResult.error) {
      console.error("Contact form inbox email failed:", inboxResult.error);
      return NextResponse.json(
        { error: "Beskeden kunne ikke sendes" },
        { status: 500 }
      );
    }

    const confirmationResult = await resend.emails.send({
      from,
      to: normalizedEmail,
      replyTo: to,
      subject: `Vi har modtaget din besked hos Yunik`,
      react: ContactConfirmation({
        customerName: normalizedName,
        subjectLabel,
        message: normalizedMessage,
        contactEmail: to,
      }),
      text:
        `Hej ${normalizedName},\n\n` +
        `Vi har modtaget din besked om "${subjectLabel}" og vender tilbage hurtigst muligt.\n\n` +
        `Din besked:\n${normalizedMessage}\n\n` +
        `Hvis du vil tilføje noget, kan du svare direkte på denne email eller skrive til ${to}.\n\n` +
        `Venlig hilsen\nYunik`,
    });

    if (confirmationResult.error) {
      console.error(
        "Contact confirmation email failed:",
        confirmationResult.error
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
