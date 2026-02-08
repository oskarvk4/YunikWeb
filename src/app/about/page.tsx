"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/ui/Container";

const values = [
  {
    title: "Quality Craftsmanship",
    description:
      "Every piece is meticulously crafted using traditional techniques and the finest materials, ensuring lasting beauty and durability.",
  },
  {
    title: "Timeless Design",
    description:
      "Our designs transcend trends, creating pieces that become cherished parts of your jewelry collection for years to come.",
  },
  {
    title: "Sustainable Practices",
    description:
      "We're committed to ethical sourcing and sustainable production methods, because beautiful jewelry shouldn't come at the earth's expense.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <Image
          src="/yunik-1.jpeg"
          alt="Yunik jewelry collection"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center px-4"
          >
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
              Our Story
            </h1>
            <p className="text-white/80 font-sans text-lg max-w-md mx-auto">
              Crafting timeless elegance since the beginning
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28 bg-white">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#8D6553] mb-4">
              About Yunik
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8">
              Celebrating Individuality
            </h2>
            <div className="space-y-6 text-[#1A1A1A]/70 font-sans leading-relaxed text-lg">
              <p>
                Yunik was born from a simple belief: that every person deserves
                jewelry as unique as they are. Our name—derived from
                &quot;unique&quot;—reflects our commitment to creating pieces that
                celebrate individuality and personal expression.
              </p>
              <p>
                Founded in Denmark, we draw inspiration from Scandinavian design
                principles: clean lines, thoughtful craftsmanship, and a deep
                respect for materials. Each piece in our collection tells a story
                of careful consideration and artistic vision.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Image Break */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-square md:aspect-auto"
          >
            <Image
              src="/yunik-11.jpg"
              alt="Yunik jewelry craftsmanship"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square md:aspect-auto"
          >
            <Image
              src="/yunik-12.jpg"
              alt="Yunik jewelry details"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-[#F5F0EB]">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A]">
              Our Values
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-4">
                  {value.title}
                </h3>
                <p className="text-[#1A1A1A]/70 font-sans leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Materials Section */}
      <section id="materials" className="py-20 md:py-28 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#8D6553] mb-4">
                Materials
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-6">
                Crafted with Care
              </h2>
              <div className="space-y-4 text-[#1A1A1A]/70 font-sans leading-relaxed">
                <p>
                  We work exclusively with high-quality materials that stand the
                  test of time. Our sterling silver pieces are crafted from
                  92.5% pure silver, while our gold jewelry features 14k and 18k
                  gold vermeil over a sterling silver base.
                </p>
                <p>
                  Every gemstone is carefully selected for its quality and
                  brilliance. We source freshwater pearls from sustainable farms
                  and use conflict-free precious stones throughout our
                  collections.
                </p>
                <p>
                  All our pieces are hypoallergenic and nickel-free, making them
                  perfect for even the most sensitive skin.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square"
            >
              <Image
                src="/yunik-17.jpeg"
                alt="Yunik jewelry materials"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Sustainability Section */}
      <section id="sustainability" className="py-20 md:py-28 bg-[#1A1A1A]">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#D4A9A5] mb-4">
              Sustainability
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-8">
              Our Commitment
            </h2>
            <div className="space-y-6 text-white/70 font-sans leading-relaxed text-lg">
              <p>
                We believe that beautiful jewelry shouldn&apos;t come at the
                cost of our planet. That&apos;s why we&apos;re committed to
                sustainable practices at every step of our process.
              </p>
              <p>
                From recycled packaging materials to ethically sourced gems, we
                strive to minimize our environmental footprint while maximizing
                the beauty and quality of our pieces.
              </p>
              <p>
                Our jewelry is designed to last a lifetime, reducing the need
                for constant replacement and contributing to a more sustainable
                fashion industry.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
