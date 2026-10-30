// Default text for all editable site copy.
//
// The defaults live in one module per page under ./copy-sections/. Every string
// in them shows up in the admin editor at /admin/copy automatically, grouped by
// page (COPY_PAGES below). Overrides are stored in the `site_copy` Supabase
// table, keyed "page.section.field", and merged on top of these defaults by
// getCopy() in src/lib/copy.ts.
//
// To make more text editable: add it to the page's module, then read it with
// `const copy = await getCopy()` in a server component, or `useCopy()` from
// "@/components/CopyProvider" in a client component.

import { siteCopy, siteTitles, siteLabels } from "./copy-sections/site";
import { homeCopy, homeTitles, homeLabels } from "./copy-sections/home";
import { shopCopy, shopTitles, shopLabels } from "./copy-sections/shop";
import { checkoutCopy, checkoutTitles, checkoutLabels } from "./copy-sections/checkout";
import { aboutCopy, aboutTitles, aboutLabels } from "./copy-sections/about";
import { contactCopy, contactTitles, contactLabels } from "./copy-sections/contact";
import { infoCopy, infoTitles, infoLabels } from "./copy-sections/info";
import { legalCopy, legalTitles, legalLabels } from "./copy-sections/legal";
import { accountCopy, accountTitles, accountLabels } from "./copy-sections/account";

export const defaultCopy = {
  ...siteCopy,
  ...homeCopy,
  ...shopCopy,
  ...checkoutCopy,
  ...aboutCopy,
  ...contactCopy,
  ...infoCopy,
  ...legalCopy,
  ...accountCopy,
} as const;

export type Copy = {
  [K in keyof typeof defaultCopy]: {
    [S in keyof (typeof defaultCopy)[K]]: {
      [F in keyof (typeof defaultCopy)[K][S]]: string;
    };
  };
};

/** Pages as the editor groups them, in this order, with a link to view each. */
export const COPY_PAGES: { key: string; title: string; href?: string }[] = [
  { key: "site", title: "Alle sider (bjælke, menu, footer)", href: "/" },
  { key: "home", title: "Forside", href: "/" },
  { key: "shop", title: "Shop", href: "/shop" },
  { key: "product", title: "Produktside", href: "/shop" },
  { key: "cart", title: "Kurv" },
  { key: "checkout", title: "Checkout", href: "/checkout" },
  { key: "about", title: "Om Yunik", href: "/about" },
  { key: "contact", title: "Kontakt", href: "/contact" },
  { key: "faq", title: "FAQ", href: "/faq" },
  { key: "care", title: "Pleje", href: "/care" },
  { key: "shipping", title: "Levering", href: "/shipping" },
  { key: "returns", title: "Returnering", href: "/returns" },
  { key: "privacy", title: "Privatlivspolitik", href: "/privacy" },
  { key: "terms", title: "Handelsbetingelser", href: "/terms" },
  { key: "auth", title: "Log ind og opret konto", href: "/auth/login" },
  { key: "account", title: "Min konto", href: "/account" },
  { key: "comingSoon", title: "Kommer snart", href: "/coming-soon" },
];

export const COPY_SECTION_TITLES: Record<string, string> = {
  ...siteTitles,
  ...homeTitles,
  ...shopTitles,
  ...checkoutTitles,
  ...aboutTitles,
  ...contactTitles,
  ...infoTitles,
  ...legalTitles,
  ...accountTitles,
};

export const COPY_FIELD_LABELS: Record<string, string> = {
  ...siteLabels,
  ...homeLabels,
  ...shopLabels,
  ...checkoutLabels,
  ...aboutLabels,
  ...contactLabels,
  ...infoLabels,
  ...legalLabels,
  ...accountLabels,
};
