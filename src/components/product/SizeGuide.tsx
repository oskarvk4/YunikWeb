"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RING_SIZE_TABLE } from "@/constants/ring-sizes";
import { useCopy } from "@/components/CopyProvider";
import { fillText } from "@/lib/copy-text";

interface SizeGuideProps {
  category: string;
  /** The size this particular ring is made in — highlighted in the table. */
  ringSize?: number | null;
}

export default function SizeGuide({ category, ringSize }: SizeGuideProps) {
  const { sizeGuide } = useCopy().product;
  const [isOpen, setIsOpen] = useState(false);

  const steps = [sizeGuide.step1, sizeGuide.step2, sizeGuide.step3];
  const tips = [sizeGuide.tip1, sizeGuide.tip2, sizeGuide.tip3];

  useEffect(() => {
    if (!isOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Only show for rings
  if (category !== "rings") return null;

  // ProductInfo's root animates `y`, so framer-motion puts a transform on it —
  // that makes it the containing block for position:fixed children and traps
  // this overlay's z-index inside that subtree, where later sections paint
  // over it. Portalling to body is what actually lifts it above the page.
  const overlay = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60]"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label={sizeGuide.dialogLabel}
            className="fixed inset-x-4 top-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md md:max-h-[85vh] bg-white z-[70] rounded-sm flex flex-col overflow-hidden"
          >
            {/* Header stays put while the body scrolls — on mobile the close
                button used to scroll out of reach. */}
            <div className="flex items-center justify-between gap-4 px-6 md:px-8 py-5 border-b border-[#1A1A1A]/10 shrink-0">
              <h2 className="font-serif text-xl font-light text-[#1A1A1A]">
                {sizeGuide.title}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                aria-label={sizeGuide.close}
                className="p-2 -mr-2 text-[#1A1A1A]/50 hover:text-[#1A1A1A] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] rounded-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="overflow-y-auto overscroll-contain px-6 md:px-8 py-5">
              {ringSize && (
                <p className="mb-5 text-sm font-sans text-[#1A1A1A]/70 leading-relaxed">
                  {sizeGuide.thisRingPrefix}{" "}
                  <span className="text-[#1A1A1A]">
                    {fillText(sizeGuide.thisRingSize, { size: ringSize })}
                  </span>{" "}
                  {fillText(sizeGuide.thisRingSuffix, { size: ringSize })}
                </p>
              )}

              <h3 className="text-xs font-sans uppercase tracking-[0.1em] text-[#1A1A1A]/50 mb-3">
                {sizeGuide.howToTitle}
              </h3>
              <ol className="space-y-2.5 mb-6">
                {steps.map((step, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-sm font-sans text-[#1A1A1A]/70 leading-relaxed"
                  >
                    <span className="shrink-0 font-serif text-[#8D6553]">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>

              <h3 className="text-xs font-sans uppercase tracking-[0.1em] text-[#1A1A1A]/50 mb-3">
                {sizeGuide.tableTitle}
              </h3>
              <table className="w-full text-sm font-sans mb-6">
                <thead>
                  <tr className="border-b border-[#1A1A1A]/10 text-[#1A1A1A]/50">
                    <th className="py-2 text-left font-normal text-xs uppercase tracking-[0.08em]">
                      {sizeGuide.columnEu}
                    </th>
                    <th className="py-2 text-left font-normal text-xs uppercase tracking-[0.08em]">
                      {sizeGuide.columnUs}
                    </th>
                    <th className="py-2 text-right font-normal text-xs uppercase tracking-[0.08em]">
                      {sizeGuide.columnDiameter}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {RING_SIZE_TABLE.map((size) => {
                    const isThisRing = size.eu === ringSize;
                    return (
                      <tr
                        key={size.eu}
                        className={`border-b border-[#1A1A1A]/5 ${
                          isThisRing
                            ? "text-[#1A1A1A] font-medium"
                            : "text-[#1A1A1A]/60"
                        }`}
                      >
                        <td className="py-1.5">
                          {size.eu}
                          {isThisRing && (
                            <span className="ml-2 text-xs font-normal text-[#8D6553]">
                              {sizeGuide.thisRingMark}
                            </span>
                          )}
                        </td>
                        <td className="py-1.5">{size.us}</td>
                        <td className="py-1.5 text-right tabular-nums">
                          {size.diameter}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <ul className="space-y-1.5 text-xs font-sans text-[#1A1A1A]/50 leading-relaxed">
                {tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>

              <p className="mt-5 pt-5 border-t border-[#1A1A1A]/10 text-sm text-[#1A1A1A]/60 font-sans">
                {sizeGuide.doubt}{" "}
                <a
                  href="/contact"
                  className="text-[#8D6553] hover:underline outline-none focus-visible:ring-2 focus-visible:ring-[#8D6553] rounded-sm"
                >
                  {sizeGuide.contactLink}
                </a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm font-sans text-[#8D6553] underline underline-offset-4 decoration-[#8D6553]/30 hover:decoration-[#8D6553] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#8D6553] focus-visible:ring-offset-2 rounded-sm"
      >
        {sizeGuide.link}
      </button>

      {typeof document !== "undefined"
        ? createPortal(overlay, document.body)
        : null}
    </>
  );
}
