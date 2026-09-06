"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function BrandStory() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/StoryPics/gemstones.webp"
                alt="Håndplukkede blågrønne ædelsten med pincet"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/StoryPics/workbench.webp"
                alt="Perler, sten og værktøj på arbejdsbordet"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </div>
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
              Et familiearkiv
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#1A1A1A] leading-tight mb-6">
              Et univers
              <br />
              samlet over tid
            </h2>
            <div className="space-y-3 text-[#1A1A1A]/70 font-sans leading-relaxed mb-8">
              <p>Samlet gennem årtiers rejser mellem Danmark, Indien og Thailand.</p>
              <p>Fra stille værksteder til håndplukkede sten.</p>
            </div>
            <Link href="/about">
              <Button variant="outline">
                Læs vores historie
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
