"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { ProductCategory } from "@/types";

const categories: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Rings", value: "rings" },
  { label: "Necklaces", value: "necklaces" },
  { label: "Earrings", value: "earrings" },
  { label: "Bracelets", value: "bracelets" },
];

const sortOptions: { label: string; value: string }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

interface FilterBarProps {
  activeCategory: string;
  activeSort: string;
  onCategoryChange: (category: string) => void;
  onSortChange: (sort: string) => void;
}

export default function FilterBar({
  activeCategory,
  activeSort,
  onCategoryChange,
  onSortChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
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
