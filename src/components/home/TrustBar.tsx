import Container from "@/components/ui/Container";

// Keep these to facts that can be backed up: no customer counts we can't document.
// `short` is shown below lg, where four (or two) columns leave little width.
const POINTS = [
  { full: "Over 30 år i Aarhus og på Bornholm", short: "30 år i fysiske butikker" },
  { full: "Tusindvis af glade kunder", short: "Tusindvis af glade kunder" },
  { full: "Håndlavet i 925 sterlingsølv", short: "Håndlavet i sterlingsølv" },
  { full: "Gratis fragt og 14 dages returret", short: "Gratis fragt i Danmark" },
];

/**
 * A thin strip of trust points directly under the hero. Its height is fixed
 * (3.5rem on phones, 2.75rem from md) because the hero subtracts it, so both
 * fit on the first screen. Change the hero's height calc if this changes.
 */
export default function TrustBar() {
  return (
    <section aria-label="Om Yunik" className="bg-white border-b border-[#1A1A1A]/10">
      <Container>
        <ul className="h-14 md:h-11 grid grid-cols-2 md:grid-cols-4 content-center items-center gap-x-4 gap-y-1">
          {POINTS.map((point) => (
            <li
              key={point.full}
              className="text-center whitespace-nowrap font-sans text-[11px] md:text-xs lg:text-[13px] tracking-wide text-[#1A1A1A]/75 md:border-l md:first:border-l-0 md:border-[#1A1A1A]/10"
            >
              <span className="lg:hidden">{point.short}</span>
              <span className="hidden lg:inline">{point.full}</span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
