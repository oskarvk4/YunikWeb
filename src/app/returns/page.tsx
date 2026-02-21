"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

export default function ReturnsPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              Returnering & Bytte
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              Din tilfredshed er vores prioritet
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-12"
          >
            {/* 14 Day Return */}
            <div className="p-8 bg-[#F5F0EB] rounded-sm text-center">
              <p className="text-5xl font-serif text-[#8D6553] mb-2">14</p>
              <p className="font-serif text-xl text-[#1A1A1A] mb-2">dages fuld returret</p>
              <p className="text-[#1A1A1A]/60 font-sans text-sm">
                I henhold til EU&apos;s forbrugerrettigheder
              </p>
            </div>

            {/* How to Return */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                Sådan returnerer du
              </h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8D6553] text-white flex items-center justify-center font-serif">
                    1
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Kontakt os</h3>
                    <p className="text-[#1A1A1A]/70 font-sans">
                      Send en email til kontakt@yunik.dk med dit ordrenummer og årsag til retur.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8D6553] text-white flex items-center justify-center font-serif">
                    2
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Pak varen</h3>
                    <p className="text-[#1A1A1A]/70 font-sans">
                      Pak smykket sikkert i originalemballagen (hvis muligt) og inkluder dit ordrenummer.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8D6553] text-white flex items-center justify-center font-serif">
                    3
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Send pakken</h3>
                    <p className="text-[#1A1A1A]/70 font-sans">
                      Send pakken til den adresse, vi oplyser i vores svaremail. Gem kvitteringen.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#8D6553] text-white flex items-center justify-center font-serif">
                    4
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Modtag refusion</h3>
                    <p className="text-[#1A1A1A]/70 font-sans">
                      Når vi har modtaget varen, refunderer vi beløbet inden 14 dage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditions */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                Betingelser for retur
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 border border-[#1A1A1A]/10 rounded-sm">
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Vi accepterer
                  </h3>
                  <ul className="space-y-2 text-[#1A1A1A]/70 font-sans text-sm">
                    <li>• Ubrugte varer i original stand</li>
                    <li>• Varer med alle mærker intakte</li>
                    <li>• Retur inden 14 dage</li>
                    <li>• Varer i originalemballage</li>
                  </ul>
                </div>
                <div className="p-6 border border-[#1A1A1A]/10 rounded-sm">
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Vi accepterer ikke
                  </h3>
                  <ul className="space-y-2 text-[#1A1A1A]/70 font-sans text-sm">
                    <li>• Brugte eller beskadigede varer</li>
                    <li>• Varer uden mærker/tags</li>
                    <li>• Personligt tilpassede smykker</li>
                    <li>• Retur efter 14 dage</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Exchange */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                Bytte til en anden størrelse
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-4">
                Har du bestilt en forkert størrelse? Ingen problem! Kontakt os, så hjælper
                vi dig med at bytte til den rigtige størrelse, forudsat at den er på lager.
              </p>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed">
                Ved bytte betaler vi for forsendelsen af den nye vare. Du betaler selv
                for at sende den originale vare retur.
              </p>
            </div>

            {/* Refund */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                Refusion
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-4">
                Vi refunderer det fulde beløb for varen. Den oprindelige fragtomkostning
                refunderes kun, hvis hele ordren returneres, og grunden til returen skyldes
                en fejl fra vores side.
              </p>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed">
                Refusionen sker til den oprindelige betalingsmetode inden 14 dage efter,
                at vi har modtaget din retur.
              </p>
            </div>

            {/* Warranty */}
            <div className="p-6 bg-[#1A1A1A] text-white rounded-sm">
              <h2 className="font-serif text-xl font-light mb-3">
                Reklamation & Garanti
              </h2>
              <p className="text-white/70 font-sans mb-4">
                Udover din 14 dages fortrydelsesret har du 2 års reklamationsret i henhold
                til købeloven. Hvis dit smykke har en fabrikationsfejl, kontakt os venligst,
                så finder vi en løsning.
              </p>
              <a
                href="/contact"
                className="inline-block text-[#D4A9A5] font-sans text-sm hover:underline"
              >
                Kontakt os om reklamation →
              </a>
            </div>

            {/* FAQ Link */}
            <div className="text-center">
              <p className="text-[#1A1A1A]/60 font-sans mb-2">
                Har du flere spørgsmål?
              </p>
              <a
                href="/faq"
                className="inline-block text-[#8D6553] font-sans hover:underline"
              >
                Se vores FAQ →
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
