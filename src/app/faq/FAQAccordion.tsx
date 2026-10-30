"use client";

import { useState } from "react";

export interface FAQItem {
  question: string;
  answer: string;
}

// The only interactive part of the FAQ page. The texts are passed in from the
// server page, where they are read from /admin/copy.
export default function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#1A1A1A]/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left"
        aria-expanded={isOpen}
      >
        <span className="font-sans text-[#1A1A1A] pr-4">{item.question}</span>
        <svg
          className="w-5 h-5 text-[#8D6553] flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "none" }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows,opacity] duration-200 ease-out"
        style={{
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="overflow-hidden">
          <p className="pb-5 text-[#1A1A1A]/70 font-sans leading-relaxed">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}
