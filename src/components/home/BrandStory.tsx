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
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/jewelry-collection.jpeg"
                alt="Yunik jewelry collection"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
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
              Our Story
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#1A1A1A] leading-tight mb-6">
              Celebrating
              <br />
              Individuality
            </h2>
            <div className="space-y-4 text-[#1A1A1A]/70 font-sans leading-relaxed mb-8">
              <p>
                At Yunik, we believe that true beauty lies in the details. Each
                piece in our collection is thoughtfully designed and meticulously
                crafted to capture the essence of modern elegance.
              </p>
              <p>
                Our jewelry is more than adornment—it&apos;s an expression of your
                unique story, a celebration of the moments that matter, and a
                testament to timeless style.
              </p>
            </div>
            <Link href="/about">
              <Button variant="outline">
                Discover Our Story
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
