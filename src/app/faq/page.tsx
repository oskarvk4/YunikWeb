"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/ui/Container";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategory {
  title: string;
  items: FAQItem[];
}

const faqData: FAQCategory[] = [
  {
    title: "Ordre & Levering",
    items: [
      {
        question: "Hvor lang tid tager leveringen?",
        answer: "Standardlevering i Danmark tager 3-5 hverdage. Vi tilbyder også ekspreslevering på 1-2 hverdage mod et tillæg. Du modtager en tracking-email, når din ordre er afsendt.",
      },
      {
        question: "Hvad koster fragten?",
        answer: "Standardfragt koster 39 DKK. Ekspresfragt koster 79 DKK. Ved køb over 500 DKK får du gratis standardlevering.",
      },
      {
        question: "Kan jeg spore min ordre?",
        answer: "Ja! Når din ordre er afsendt, modtager du en email med et tracking-nummer, så du kan følge pakken hele vejen.",
      },
      {
        question: "Sender I internationalt?",
        answer: "Ja, vi sender til Sverige, Norge, Tyskland og øvrige EU-lande. Leveringstiden varierer afhængigt af destination.",
      },
    ],
  },
  {
    title: "Returnering & Bytte",
    items: [
      {
        question: "Hvad er jeres returpolitik?",
        answer: "Du har 14 dages fuld returret fra den dag, du modtager varen. Varen skal være ubrugt og i original stand. Kontakt os på kontakt@yunik.dk for at starte en retur.",
      },
      {
        question: "Kan jeg bytte til en anden størrelse?",
        answer: "Ja, hvis du har bestilt en forkert størrelse, hjælper vi gerne med at bytte. Kontakt os, og vi finder en løsning.",
      },
      {
        question: "Hvem betaler returfragt?",
        answer: "Ved almindelig fortrydelse betaler du selv returfragten. Hvis varen er defekt eller vi har sendt en forkert vare, betaler vi naturligvis fragten.",
      },
      {
        question: "Hvornår får jeg mine penge tilbage?",
        answer: "Vi refunderer inden 14 dage efter, vi har modtaget din retur. Pengene tilbageføres til den oprindelige betalingsmetode.",
      },
    ],
  },
  {
    title: "Produkter & Størrelser",
    items: [
      {
        question: "Hvordan finder jeg min ringstørrelse?",
        answer: "Du kan bruge en eksisterende ring og måle dens indvendige diameter. Se vores størrelsesguide på produktsiden for at finde den rigtige størrelse.",
      },
      {
        question: "Hvilke materialer bruger I?",
        answer: "Vi bruger primært sterlingsølv (92,5% sølv) og 14/18 karat guldbelægning. Alle vores smykker er nikkelfri og hypoallergene.",
      },
      {
        question: "Er jeres smykker hypoallergene?",
        answer: "Ja, alle vores smykker er nikkelfri og egnet til følsom hud. Vi bruger kun materialer af høj kvalitet.",
      },
      {
        question: "Hvordan plejer jeg mine smykker?",
        answer: "Opbevar dine smykker tørt og adskilt. Undgå kontakt med parfume, hårlak og kemikalier. Se vores plejeguide for detaljerede instruktioner.",
      },
    ],
  },
  {
    title: "Betaling & Sikkerhed",
    items: [
      {
        question: "Hvilke betalingsmetoder accepterer I?",
        answer: "Vi accepterer Visa, Mastercard, MobilePay og bankoverførsel. Alle betalinger håndteres sikkert.",
      },
      {
        question: "Er det sikkert at handle hos jer?",
        answer: "Ja, vi bruger SSL-kryptering og sikre betalingsløsninger. Vi gemmer aldrig dine kortoplysninger.",
      },
      {
        question: "Hvornår trækkes pengene?",
        answer: "Beløbet trækkes først, når din ordre afsendes. Ved forudbestilling kan beløbet dog trækkes ved bestilling.",
      },
    ],
  },
];

function FAQAccordion({ item }: { item: FAQItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#1A1A1A]/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="font-sans text-[#1A1A1A] pr-4">{item.question}</span>
        <motion.svg
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-[#8D6553] flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-[#1A1A1A]/70 font-sans leading-relaxed">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
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
              Ofte Stillede Spørgsmål
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              Find svar på de mest almindelige spørgsmål
            </p>
          </motion.div>
        </Container>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-12"
          >
            {faqData.map((category) => (
              <div key={category.title}>
                <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                  {category.title}
                </h2>
                <div>
                  {category.items.map((item, index) => (
                    <FAQAccordion key={index} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 text-center p-8 bg-[#F5F0EB] rounded-sm"
          >
            <h3 className="font-serif text-xl text-[#1A1A1A] mb-3">
              Fandt du ikke svaret?
            </h3>
            <p className="text-[#1A1A1A]/70 font-sans mb-6">
              Vi er altid klar til at hjælpe dig
            </p>
            <a
              href="/contact"
              className="inline-block px-8 py-3 bg-[#1A1A1A] text-white font-sans text-sm uppercase tracking-wider hover:bg-[#333] transition-colors"
            >
              Kontakt Os
            </a>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
