import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { HideOnAdmin } from "@/components/layout/SiteChrome";
import { AuthProvider } from "@/components/auth/AuthProvider";
import AuthErrorHandler from "@/components/auth/AuthErrorHandler";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MetaPixel from "@/components/analytics/MetaPixel";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import "./globals.css";

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

export const metadata: Metadata = {
  title: {
    default: "Yunik | Tidløs Elegance",
    template: "%s | Yunik",
  },
  description: "Opdag unikke, håndlavede smykker der fejrer individualitet. Shop ringe, halskæder, øreringe og armbånd fra Yunik.",
  keywords: ["smykker", "luksus", "håndlavet", "ringe", "halskæder", "øreringe", "armbånd", "danske smykker", "yunik"],
  authors: [{ name: "Yunik" }],
  creator: "Yunik",
  publisher: "Yunik",
  metadataBase: new URL("https://yunik.dk"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "da_DK",
    url: "https://yunik.dk",
    siteName: "Yunik",
    title: "Yunik | Tidløs Elegance",
    description: "Opdag unikke, håndlavede smykker der fejrer individualitet.",
    images: [
      {
        url: "/hero-bracelet.webp",
        width: 1200,
        height: 630,
        alt: "Yunik Smykker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Yunik | Tidløs Elegance",
    description: "Opdag unikke, håndlavede smykker der fejrer individualitet.",
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

// Organization JSON-LD Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yunik",
  url: "https://yunik.dk",
  logo: "https://yunik.dk/logo.png",
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

// WebSite JSON-LD Schema for search
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yunik",
  url: "https://yunik.dk",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://yunik.dk/shop?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" data-scroll-behavior="smooth">
      <head>
        {/* Preload hero image for LCP optimization */}
        <link rel="preload" as="image" href="/yunik-16.webp" type="image/webp" media="(max-width: 767px)" />
        <link rel="preload" as="image" href="/hero-rings.webp" type="image/webp" media="(min-width: 768px)" />

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
          <AuthErrorHandler />
          <Navbar />
          <main className="min-h-screen">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <HideOnAdmin>
            <Footer />
          </HideOnAdmin>
        </AuthProvider>
      </body>
    </html>
  );
}
