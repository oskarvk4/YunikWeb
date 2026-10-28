"use client";

import { giftLabels } from "@/lib/storefront";

// Every category is always shown, even with few or no pieces. Most pieces first.
export const CATEGORY_FILTERS: { label: string; value: string }[] = [
  { label: "Alle", value: "all" },
  { label: "Øreringe", value: "earrings" },
  { label: "Ringe", value: "rings" },
  { label: "Halskæder", value: "necklaces" },
  { label: "Armbånd", value: "bracelets" },
];

const sortOptions: { label: string; value: string }[] = [
  { label: "Nyeste", value: "newest" },
  { label: "Pris: Lav til Høj", value: "price-asc" },
  { label: "Pris: Høj til Lav", value: "price-desc" },
];

const metals: { label: string; value: string }[] = [
  { label: "Sølv", value: "silver" },
  { label: "Guld", value: "gold" },
];

// Outline gift box (Tabler shapes), drawn in the chip's text colour.
function GiftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-3.5 w-3.5 shrink-0"
    >
      <path d="M3 9a1 1 0 0 1 1 -1h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1z" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0 -5a4.8 8 0 0 1 4.5 5a4.8 8 0 0 1 4.5 -5a2.5 2.5 0 0 1 0 5" />
    </svg>
  );
}

interface FilterBarProps {
  activeCategory: string;
  activeSort: string;
  activeMetals: string[];
  underPriceActive: boolean;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onMetalToggle: (metal: string) => void;
  onUnderPriceToggle: () => void;
}

export default function FilterBar({
  activeCategory,
  activeSort,
  activeMetals,
  underPriceActive,
  onCategoryChange,
  onSortChange,
  onMetalToggle,
  onUnderPriceToggle,
}: FilterBarProps) {
  const gift = giftLabels();

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 mb-6">
      {/* Category + Metal Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORY_FILTERS.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`shrink-0 px-4 py-2 text-xs font-sans uppercase tracking-[0.15em] transition-all duration-300 ${
              activeCategory === category.value
                ? "bg-[#1A1A1A] text-white"
                : "bg-transparent text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
            }`}
          >
            {category.label}
          </button>
        ))}

        <span className="basis-full md:hidden" aria-hidden="true" />
        <span className="hidden md:inline-block h-5 w-px bg-[#1A1A1A]/15 mx-1" />

        {metals.map((metal) => {
          const isActive = activeMetals.includes(metal.value);
          return (
            <button
              key={metal.value}
              type="button"
              onClick={() => onMetalToggle(metal.value)}
              aria-pressed={isActive}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans uppercase tracking-[0.15em] border transition-all duration-300 ${
                isActive
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                  : "bg-transparent text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40"
              }`}
            >
              <span
                className={`w-3 h-3 rounded-full border ${
                  metal.value === "gold"
                    ? "bg-[#D4AF37] border-[#a88a25]"
                    : "bg-[#C0C0C0] border-[#7d7d7d]"
                }`}
              />
              {metal.label}
            </button>
          );
        })}

        <button
          type="button"
          onClick={onUnderPriceToggle}
          aria-pressed={underPriceActive}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans uppercase tracking-[0.15em] border transition-all duration-300 ${
            underPriceActive
              ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
              : "bg-transparent text-[#1A1A1A] border-[#1A1A1A]/20 hover:border-[#1A1A1A]/40"
          }`}
        >
          {gift.christmas && <GiftIcon />}
          {gift.chip}
        </button>
      </div>

      {/* Sort Dropdown */}
      <div className="relative self-end md:self-auto">
        <select
          value={activeSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="appearance-none bg-transparent border border-[#1A1A1A]/20 px-4 py-2 pr-10 text-sm font-sans text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]/40 cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1A1A]/60 pointer-events-none"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
