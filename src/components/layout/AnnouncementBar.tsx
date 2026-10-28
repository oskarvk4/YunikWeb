"use client";

import { useEffect, useState, type ReactNode } from "react";

// Outline icons (Tabler shapes), drawn in the accent colour.
function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[15px] w-[15px] shrink-0 text-[#8D6553]"
    >
      {children}
    </svg>
  );
}

const ShopIcon = (
  <Icon>
    <path d="M3 21h18" />
    <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
    <path d="M5 21v-10.15M19 21v-10.15" />
    <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
  </Icon>
);
const HeartIcon = (
  <Icon>
    <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
  </Icon>
);
const DiamondIcon = (
  <Icon>
    <path d="M6 5h12l3 5l-8.5 9.5a.7 .7 0 0 1 -1 0l-8.5 -9.5l3 -5" />
    <path d="M10 12l-2 -2.2l.6 -1" />
  </Icon>
);
const TruckIcon = (
  <Icon>
    <path d="M5 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M15 17a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v12m-4 0h6m4 0h2v-6h-8m0 -5h5l3 5" />
  </Icon>
);

// Keep these to facts that can be backed up.
// `short` is the one-at-a-time text on phones and tablets, with shipping first.
const POINTS = [
  { icon: TruckIcon, short: "Gratis fragt og 14 dages retur", full: "Gratis fragt og 14 dages retur" },
  { icon: ShopIcon, short: "Over 30 år i fysiske butikker", full: "Over 30 år i Aarhus og på Bornholm" },
  { icon: HeartIcon, short: "+20.000 glade kunder", full: "+20.000 glade kunder" },
  { icon: DiamondIcon, short: "Håndlavet i 925 sterlingsølv", full: "Håndlavet i 925 sterlingsølv" },
];

// On desktop the four points sit side by side in this order.
const DESKTOP_ORDER = [1, 2, 3, 0];

const ROTATE_MS = 4000;

/**
 * Powder-pink trust bar above the menu on every storefront page. It sits inside
 * the fixed header and is exactly h-8 (2rem); Navbar adds a matching spacer so
 * page content starts below it. From lg all four points show in a row; below lg
 * one shows at a time and they crossfade, except for people who prefer reduced
 * motion, who keep the first one.
 */
export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % POINTS.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section
      aria-label="Fordele ved Yunik"
      className="h-8 border-b border-[#D4A9A5]/40 bg-[#EFDCD8] text-[#1A1A1A]"
    >
      {/* lg and up: all four points */}
      <ul className="mx-auto hidden h-full max-w-7xl grid-cols-4 px-4 font-sans text-[12px] tracking-[0.04em] lg:grid lg:px-8">
        {DESKTOP_ORDER.map((n, col) => (
          <li
            key={POINTS[n].full}
            className={`flex items-center justify-center gap-2 whitespace-nowrap ${
              col > 0 ? "border-l border-[#1A1A1A]/10" : ""
            }`}
          >
            {POINTS[n].icon}
            {POINTS[n].full}
          </li>
        ))}
      </ul>

      {/* Below lg: one at a time */}
      <div className="relative h-full overflow-hidden font-sans text-[12px] tracking-[0.04em] lg:hidden">
        {POINTS.map((point, i) => (
          <p
            key={point.short}
            aria-hidden={i !== index}
            className={`absolute inset-0 flex items-center justify-center gap-2 whitespace-nowrap px-4 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {point.icon}
            {point.short}
          </p>
        ))}
      </div>
    </section>
  );
}
