"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SizeGuideProps {
  category: string;
}

const ringSizes = [
  { eu: "48", us: "4.5", diameter: "15.3mm" },
  { eu: "50", us: "5.5", diameter: "15.9mm" },
  { eu: "52", us: "6", diameter: "16.5mm" },
  { eu: "54", us: "7", diameter: "17.2mm" },
  { eu: "56", us: "7.5", diameter: "17.8mm" },
  { eu: "58", us: "8.5", diameter: "18.5mm" },
  { eu: "60", us: "9", diameter: "19.1mm" },
];

export default function SizeGuide({ category }: SizeGuideProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only show for rings
  if (category !== "rings") return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-[#8D6553] font-sans hover:underline flex items-center gap-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#8D6553] focus-visible:ring-offset-2 rounded-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Størrelsesguide
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg bg-white z-50 overflow-y-auto max-h-[90vh] rounded-sm"
            >
              <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-2xl font-light text-[#1A1A1A]">
                    Størrelsesguide - Ringe
                  </h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 -mr-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 rounded-sm"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* How to measure */}
                <div className="mb-8">
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-3">
                    Sådan måler du din størrelse
                  </h3>
                  <ol className="space-y-3 text-sm text-[#1A1A1A]/70 font-sans">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#8D6553] text-white rounded-full flex items-center justify-center text-xs">1</span>
                      <span>Find en ring der passer godt på den finger, du vil måle</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#8D6553] text-white rounded-full flex items-center justify-center text-xs">2</span>
                      <span>Mål den indvendige diameter i millimeter</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-[#8D6553] text-white rounded-full flex items-center justify-center text-xs">3</span>
                      <span>Find din størrelse i tabellen nedenfor</span>
                    </li>
                  </ol>
                </div>

                {/* Size table */}
                <div className="mb-6">
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-3">
                    Størrelsestabel
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm font-sans">
                      <thead>
                        <tr className="border-b border-[#1A1A1A]/10">
                          <th className="py-2 text-left font-medium text-[#1A1A1A]">EU</th>
                          <th className="py-2 text-left font-medium text-[#1A1A1A]">US</th>
                          <th className="py-2 text-left font-medium text-[#1A1A1A]">Diameter</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ringSizes.map((size) => (
                          <tr key={size.eu} className="border-b border-[#1A1A1A]/5">
                            <td className="py-2 text-[#1A1A1A]/70">{size.eu}</td>
                            <td className="py-2 text-[#1A1A1A]/70">{size.us}</td>
                            <td className="py-2 text-[#1A1A1A]/70">{size.diameter}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Tips */}
                <div className="p-4 bg-[#F5F0EB] rounded-sm">
                  <h4 className="font-serif text-sm font-medium text-[#1A1A1A] mb-2">
                    Tips
                  </h4>
                  <ul className="space-y-1 text-xs text-[#1A1A1A]/70 font-sans">
                    <li>• Mål ved stuetemperatur - fingre ændrer størrelse i varme/kulde</li>
                    <li>• Mål flere gange på forskellige tidspunkter af dagen</li>
                    <li>• Er du i tvivl, vælg den større størrelse</li>
                  </ul>
                </div>

                {/* Contact */}
                <p className="mt-6 text-sm text-[#1A1A1A]/60 font-sans text-center">
                  Stadig i tvivl?{" "}
                  <a href="/contact" className="text-[#8D6553] hover:underline outline-none focus-visible:ring-2 focus-visible:ring-[#8D6553] rounded-sm">
                    Kontakt os
                  </a>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
