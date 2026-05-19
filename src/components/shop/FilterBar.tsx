"use client";

const categories: { label: string; value: string }[] = [
  { label: "Alle", value: "all" },
  { label: "Ringe", value: "rings" },
  { label: "Halskæder", value: "necklaces" },
  { label: "Øreringe", value: "earrings" },
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

interface FilterBarProps {
  activeCategory: string;
  activeSort: string;
  activeMetals: string[];
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
  onMetalToggle: (metal: string) => void;
}

export default function FilterBar({
  activeCategory,
  activeSort,
  activeMetals,
  onCategoryChange,
  onSortChange,
  onMetalToggle,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      {/* Category Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className={`px-4 py-2 text-xs font-sans uppercase tracking-[0.15em] transition-all duration-300 ${
              activeCategory === category.value
                ? "bg-[#1A1A1A] text-white"
                : "bg-transparent text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
            }`}
          >
            {category.label}
          </button>
        ))}

        <span className="hidden md:inline-block h-5 w-px bg-[#1A1A1A]/15 mx-1" />

        {metals.map((metal) => {
          const isActive = activeMetals.includes(metal.value);
          return (
            <button
              key={metal.value}
              type="button"
              onClick={() => onMetalToggle(metal.value)}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-sans uppercase tracking-[0.15em] border transition-all duration-300 ${
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
      </div>

      {/* Sort Dropdown */}
      <div className="relative">
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
