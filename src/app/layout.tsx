import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getVisibleCategories } from "@/data/products";
import { getCopy } from "@/lib/copy";
import { toClientCopy } from "@/lib/copy-text";
import { CopyProvider } from "@/components/CopyProvider";
import { HideOnAdmin } from "@/components/layout/SiteChrome";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AuthErrorHandler from "@/components/auth/AuthErrorHandler";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import CookieConsent from "@/components/layout/CookieConsent";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import "./globals.css";
import { SITE_URL, absoluteUrl } from "@/lib/site";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const text = (await getCopy()).site.metadata;

  return {
    title: {
      default: text.title,
      template: text.titleTemplate,
    },
    description: text.description,
    keywords: ["smykker", "luksus", "håndlavet", "ringe", "halskæder", "øreringe", "armbånd", "danske smykker", "yunik"],
    authors: [{ name: "Yunik" }],
    creator: "Yunik",
    publisher: "Yunik",
    metadataBase: new URL(SITE_URL),
    // No site-wide canonical: each page sets its own. A default of "/" here made
    // every page without one (login, checkout, 404…) claim to be the homepage.
    openGraph: {
      type: "website",
      locale: "da_DK",
      url: SITE_URL,
      siteName: "Yunik",
      title: text.shareTitle,
      description: text.shareDescription,
      images: [
        {
          url: "/hero-bracelet.webp",
          width: 1200,
          height: 630,
          alt: text.shareImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: text.shareTitle,
      description: text.shareDescription,
      images: ["/hero-bracelet.webp"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

// Organization JSON-LD Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yunik",
  url: SITE_URL,
  logo: absoluteUrl("/hero-bracelet.webp"),
  description: "Håndlavede smykker med tidløs elegance. Ringe, halskæder, øreringe og armbånd.",
  address: {
    "@type": "PostalAddress",
    addressCountry: "DK",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "kontakt@yunik.dk",
    contactType: "customer service",
    availableLanguage: ["Danish", "English"],
  },
  sameAs: [
    "https://instagram.com/yunik",
    "https://facebook.com/yunik",
  ],
};

// WebSite JSON-LD Schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yunik",
  url: SITE_URL,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [visibleCategories, copy] = await Promise.all([getVisibleCategories(), getCopy()]);

  return (
    <html lang="da" data-scroll-behavior="smooth">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://dqieqdaisfahomevryvg.supabase.co" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://dqieqdaisfahomevryvg.supabase.co" />

        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Script
          id="website-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <GoogleAnalytics />
        <MetaPixel />
      </head>
      <body
        className={`${cormorant.variable} ${dmSans.variable} antialiased`}
      >
        <AuthProvider>
          <CopyProvider copy={toClientCopy(copy)}>
            <AuthErrorHandler />
            <Navbar
              visibleCategories={visibleCategories}
              announcement={[copy.site.announcement.message1, copy.site.announcement.message2]}
            />
            {/* overflow-x-clip stops slide-in animations (BrandStory, FadeIn) from widening
                the page on phones; unlike overflow-hidden it keeps position: sticky working. */}
            <main className="min-h-screen overflow-x-clip">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
            <HideOnAdmin>
              <Footer />
              <CookieConsent />
            </HideOnAdmin>
          </CopyProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
