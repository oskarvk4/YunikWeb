"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function BrandStory() {
  return (
    <section className="py-20 md:py-28 bg-white overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-12 gap-4">
              {/* Main image */}
              <div className="col-span-7 relative aspect-[3/4] overflow-hidden">
                <Image
                  src="/97f780c9-11de-42a1-8e1a-7d8a29fde05a.jpeg"
                  alt="Yunik håndlavede guldringe"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 60vw, 30vw"
                />
              </div>
              {/* Secondary image */}
              <div className="col-span-5 relative aspect-[3/4] overflow-hidden mt-12">
                <Image
                  src="/5ee239d6-847d-4d36-b6f2-6ac15c1ed909.jpeg"
                  alt="Yunik smykker i hverdagen"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 40vw, 20vw"
                />
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#D4A9A5]/20 -z-10" />
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-[#8D6553]/10 -z-10" />
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pl-8"
          >
            <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#8D6553] mb-4">
              Vores Historie
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#1A1A1A] leading-tight mb-6">
              Fejrer
              <br />
              Individualitet
            </h2>
            <div className="space-y-4 text-[#1A1A1A]/70 font-sans leading-relaxed mb-8">
              <p>
                Hos Yunik tror vi på, at sand skønhed ligger i detaljerne. Hvert
                smykke i vores kollektion er omhyggeligt designet og
                fremstillet for at fange essensen af moderne elegance.
              </p>
              <p>
                Vores smykker er mere end pynt — det er et udtryk for din
                unikke historie, en fejring af de øjeblikke der betyder noget,
                og et vidnesbyrd om tidløs stil.
              </p>
            </div>
            <Link href="/about">
              <Button variant="outline">
                Opdag Vores Historie
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
