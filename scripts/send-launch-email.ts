/**
 * Send the "doors are open" launch email to the early-access list. Each
 * recipient gets a personal link that lets them into the shop while the
 * coming-soon gate is still on (see src/lib/early-access.ts).
 * Dry run by default — nothing is sent and nothing is written.
 *
 * Usage:
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/send-launch-email.ts                        # dry run
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/send-launch-email.ts --preview=out.html     # write the HTML to a file
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/send-launch-email.ts --test=you@example.com # one [TEST] copy, list untouched
 *   NODE_TLS_REJECT_UNAUTHORIZED=0 npx tsx scripts/send-launch-email.ts --send --confirm       # the real send
 *
 * Test and preview copies carry a preview link that works for 3 days and is
 * not tied to anyone on the list.
 *
 * The real send only goes to rows whose notified_at is empty, and sets
 * notified_at after each successful send, so a crash or rerun never
 * double-sends. Before sending it opens a preview link on the live site and
 * refuses to go on unless that lands in the shop — which proves the access
 * route is deployed and EARLY_ACCESS_SECRET matches production.
 */

import { writeFileSync } from "node:fs";
import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { render } from "@react-email/render";
import { Resend } from "resend";
import LaunchAnnouncement, {
  LAUNCH_SUBJECT,
  launchAnnouncementText,
} from "../src/emails/LaunchAnnouncement";
import { createLinkToken, createPreviewLinkToken } from "../src/lib/early-access";

config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const resendApiKey = process.env.RESEND_API_KEY;

if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or RESEND_API_KEY"
  );
  process.exit(1);
}

const arg = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
const flag = (name: string) => process.argv.includes(`--${name}`);

const SITE_URL = (process.env.LAUNCH_SITE_URL || "https://www.yunik.dk").replace(/\/$/, "");
const FROM = process.env.EMAIL_FROM || "Yunik <kontakt@yunik.dk>";
const CONTACT_EMAIL =
  process.env.REPLY_TO_EMAIL || process.env.CONTACT_EMAIL || "kontakt@yunik.dk";
// Resend's default limit is 2 requests per second.
const DELAY_MS = 600;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

const mask = (email: string) => {
  const [local, domain] = email.split("@");
  return `${local.slice(0, 2)}***@${domain}`;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const accessUrl = (token: string) => `${SITE_URL}/early-access/${token}`;

async function renderEmail(link: string) {
  const props = { accessUrl: link, contactEmail: CONTACT_EMAIL };
  const html = await render(LaunchAnnouncement(props));
  return { html, text: launchAnnouncementText(props) };
}

/** True when a preview link on the live site lands in the shop. */
async function liveLinkWorks(): Promise<boolean> {
  const response = await fetch(accessUrl(await createPreviewLinkToken()), {
    redirect: "manual",
  });
  const location = response.headers.get("location") ?? "";
  return location.endsWith("/shop");
}

async function pendingRecipients() {
  const { data, error } = await supabase
    .from("early_access_subscribers")
    .select("id, email")
    .is("notified_at", null)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as { id: string; email: string }[];
}

async function main() {
  const previewPath = arg("preview");
  if (previewPath) {
    const { html } = await renderEmail(accessUrl(await createPreviewLinkToken()));
    writeFileSync(previewPath, html);
    console.log(`Wrote preview to ${previewPath}`);
    return;
  }

  const testTo = arg("test");
  if (testTo) {
    const { html, text } = await renderEmail(accessUrl(await createPreviewLinkToken()));
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: testTo,
      replyTo: CONTACT_EMAIL,
      subject: `[TEST] ${LAUNCH_SUBJECT}`,
      html,
      text,
    });
    if (error) throw new Error(`Test send failed: ${error.message}`);
    console.log(`Sent one test copy to ${testTo} (id ${data?.id}). The list was not touched.`);
    return;
  }

  const recipients = await pendingRecipients();
  console.log(`From:     ${FROM}`);
  console.log(`Reply-to: ${CONTACT_EMAIL}`);
  console.log(`Subject:  ${LAUNCH_SUBJECT}`);
  console.log(`Links:    ${SITE_URL}/early-access/<personal token>`);
  console.log(`Not yet notified: ${recipients.length}`);

  if (!(flag("send") && flag("confirm"))) {
    for (const r of recipients) console.log(`  would send to ${mask(r.email)}`);
    console.log("\nDry run: nothing sent. Use --send --confirm for the real send.");
    return;
  }

  if (!(await liveLinkWorks())) {
    console.error(
      `A preview link on ${SITE_URL} did not land in the shop. Deploy the early-access route and make sure EARLY_ACCESS_SECRET in production matches .env.local.`
    );
    process.exit(1);
  }

  let sent = 0;
  const failed: string[] = [];

  for (const r of recipients) {
    const { html, text } = await renderEmail(accessUrl(await createLinkToken(r.id)));
    const { error } = await resend.emails.send(
      { from: FROM, to: r.email, replyTo: CONTACT_EMAIL, subject: LAUNCH_SUBJECT, html, text },
      // Same key on a rerun, so Resend drops a duplicate within 24 hours.
      { idempotencyKey: `launch-email/${r.id}` }
    );

    if (error) {
      failed.push(r.email);
      console.error(`  failed  ${mask(r.email)}: ${error.message}`);
    } else {
      const { error: updateError } = await supabase
        .from("early_access_subscribers")
        .update({ notified_at: new Date().toISOString() })
        .eq("id", r.id);
      if (updateError) {
        console.error(`  sent to ${mask(r.email)} but could not set notified_at: ${updateError.message}`);
      } else {
        console.log(`  sent    ${mask(r.email)}`);
      }
      sent++;
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone: ${sent} sent, ${failed.length} failed.`);
  if (failed.length) console.log("Rerun the same command to retry the failed ones.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
