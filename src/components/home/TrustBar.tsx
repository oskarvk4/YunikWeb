import type { ReactNode } from "react";
import Container from "@/components/ui/Container";

// Outline icons (Tabler shapes), drawn in the current text colour.
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
      className="h-[17px] w-[17px] md:h-5 md:w-5 shrink-0 text-[#8D6553]"
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
// `short` is shown below xl, where four (or two) columns leave little width.
const POINTS = [
  { icon: ShopIcon, full: "Over 30 år i Aarhus og på Bornholm", short: "30 år i butikker" },
  { icon: HeartIcon, full: "+20.000 glade kunder", short: "+20.000 kunder" },
  { icon: DiamondIcon, full: "Håndlavet i 925 sterlingsølv", short: "925 sterlingsølv" },
  { icon: TruckIcon, full: "Fri fragt og 14 dages returret", short: "Fri fragt i DK" },
];

/**
 * Trust points directly under the hero, each with an icon in the accent colour.
 * Its height is fixed (5.25rem on phones, 4rem from md) because the hero
 * subtracts it, so both fit on the first screen. Change the hero's height calc
 * in HeroCarousel if this changes.
 */
export default function TrustBar() {
  return (
    <section aria-label="Om Yunik" className="bg-white border-b border-[#1A1A1A]/10">
      <Container>
        <ul className="h-[5.25rem] md:h-16 grid grid-cols-2 md:grid-cols-4 content-center items-center gap-x-3 gap-y-2.5 md:gap-x-0">
          {POINTS.map((point) => (
            <li
              key={point.full}
              className="flex items-center gap-2 md:justify-center md:gap-2.5 whitespace-nowrap font-serif text-[13px] md:text-sm xl:text-[15px] text-[#1A1A1A] md:border-l md:first:border-l-0 md:border-[#1A1A1A]/10"
            >
              {point.icon}
              <span className="xl:hidden">{point.short}</span>
              <span className="hidden xl:inline">{point.full}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
