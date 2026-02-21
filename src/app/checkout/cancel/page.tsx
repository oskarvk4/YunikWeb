"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function CheckoutCancelPage() {
  return (
    <div className="pt-20">
      <section className="py-16 md:py-24">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-[#F5F0EB] rounded-full flex items-center justify-center mx-auto mb-8">
              <svg
                className="w-10 h-10 text-[#1A1A1A]/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            <h1 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4">
              Betaling annulleret
            </h1>

            <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-8 max-w-md mx-auto">
              Din betaling blev ikke gennemført. Bare rolig - dine varer ligger
              stadig i kurven, og du kan prøve igen når du er klar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout">
                <Button variant="primary" size="lg">
                  Prøv igen
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="lg">
                  Fortsæt Shopping
                </Button>
              </Link>
            </div>

            <div className="mt-12 p-6 bg-[#F5F0EB] rounded-sm">
              <h2 className="font-serif text-lg text-[#1A1A1A] mb-2">
                Brug for hjælp?
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans text-sm mb-3">
                Hvis du oplever problemer med betalingen, er du velkommen til at kontakte os.
              </p>
              <a
                href="/contact"
                className="text-[#8D6553] font-sans text-sm hover:underline"
              >
                Kontakt kundeservice →
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
