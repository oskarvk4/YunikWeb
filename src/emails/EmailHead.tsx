import { Head } from "@react-email/components";

/**
 * Shared <head> for every email.
 *
 * The color-scheme metas ask mail apps to keep the site's light palette in
 * dark mode instead of inverting it. Apple Mail, iOS Mail and Outlook respect
 * this; the Gmail apps ignore it and invert anyway, which is why the logo
 * image carries its own beige ground (see Logo.tsx).
 *
 * The site fonts load where web fonts are supported (Apple Mail, iOS Mail);
 * everywhere else the Georgia / system fallbacks in styles.ts apply.
 */
export default function EmailHead() {
  return (
    <Head>
      <meta name="color-scheme" content="light only" />
      <meta name="supported-color-schemes" content="light only" />
      <style>{`:root { color-scheme: light only; supported-color-schemes: light only; }`}</style>
      {/* Emails are standalone documents, not Next pages, so the page-font rule doesn't apply. */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=DM+Sans:wght@400;500&display=swap"
        rel="stylesheet"
      />
    </Head>
  );
}
