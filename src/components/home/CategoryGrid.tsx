"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/ui/Container";
import type { HomeTile } from "@/lib/storefront";

const DEFAULT_CONTENT = {
  headline: "Shop efter Kategori",
  body: "Udforsk vores kuraterede kollektioner af tidløse smykker",
};

export default function CategoryGrid({
  tiles,
  content = DEFAULT_CONTENT,
}: {
  tiles: HomeTile[];
  content?: { headline: string; body: string };
}) {
  return (
    <section className="py-14 md:py-28 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8 md:mb-16"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-4">
            {content.headline}
          </h2>
          <p className="text-[#1A1A1A]/60 font-sans max-w-md mx-auto">
            {content.body}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {tiles.map((tile, index) => (
            <motion.div
              key={tile.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={tile.href} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-[#F5F0EB]">
                  {/* Image */}
                  <Image
                    src={tile.image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />

                  {/* Overlay label, tablets and up */}
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  <div className="hidden md:flex absolute inset-0 flex-col items-center justify-end p-6">
                    <h3 className="font-serif text-2xl font-light text-white mb-2 transform group-hover:-translate-y-2 transition-transform duration-500">
                      {tile.label}
                    </h3>
                    <span className="text-xs font-sans uppercase tracking-[0.2em] text-white/80 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      Udforsk
                    </span>
                  </div>
                </div>

                {/* Phones: the name sits under the photo, where light photos can't wash it out. */}
                <h3 className="md:hidden mt-3 font-serif text-xl font-light text-[#1A1A1A] text-balance">
                  {tile.label}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
