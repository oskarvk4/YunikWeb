"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Lines from "@/components/ui/Lines";
import type { Copy } from "@/content/copy";

// Texts come from /admin/copy (home.brandStory).
export default function BrandStory({ content }: { content: Copy["home"]["brandStory"] }) {
  return (
    <section className="py-14 md:py-28 bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-3 md:gap-4"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/StoryPics/gemstones.webp"
                alt={content.image1Alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/StoryPics/workbench.webp"
                alt={content.image2Alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 50vw, 25vw"
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
              {content.kicker}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-[#1A1A1A] leading-tight mb-6">
              <Lines text={content.headline} />
            </h2>
            <div className="space-y-3 text-[#1A1A1A]/70 font-sans leading-relaxed mb-8">
              <p>{content.paragraph1}</p>
              {content.paragraph2 && <p>{content.paragraph2}</p>}
            </div>
            <Link href="/about">
              <Button variant="outline">
                {content.button}
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
