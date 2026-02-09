"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Container from "@/components/ui/Container";

const values = [
  {
    title: "Kvalitetshåndværk",
    description:
      "Hvert smykke er omhyggeligt fremstillet ved hjælp af traditionelle teknikker og de fineste materialer, hvilket sikrer varig skønhed og holdbarhed.",
  },
  {
    title: "Tidløst Design",
    description:
      "Vores designs transcenderer trends og skaber stykker, der bliver elskede dele af din smykkesamling i mange år fremover.",
  },
  {
    title: "Bæredygtig Praksis",
    description:
      "Vi er engagerede i etisk sourcing og bæredygtige produktionsmetoder, fordi smukke smykker ikke skal koste jorden.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <Image
          src="/yunik-1.jpeg"
          alt="Yunik smykkekollektion"
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
              Vores Historie
            </h1>
            <p className="text-white/80 font-sans text-lg max-w-md mx-auto">
              Skaber tidløs elegance fra begyndelsen
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
              Om Yunik
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8">
              Fejrer Individualitet
            </h2>
            <div className="space-y-6 text-[#1A1A1A]/70 font-sans leading-relaxed text-lg">
              <p>
                Yunik blev født af en simpel overbevisning: at alle fortjener
                smykker lige så unikke som dem selv. Vores navn—afledt af
                &quot;unique&quot;—afspejler vores engagement i at skabe stykker, der
                fejrer individualitet og personligt udtryk.
              </p>
              <p>
                Grundlagt i Danmark trækker vi inspiration fra skandinaviske design
                principper: rene linjer, omhyggeligt håndværk og en dyb
                respekt for materialer. Hvert smykke i vores kollektion fortæller en historie
                om nøje overvejelse og kunstnerisk vision.
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
              alt="Yunik smykkehåndværk"
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
              alt="Yunik smykkedetaljer"
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
              Vores Værdier
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
                Materialer
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-6">
                Skabt med Omhu
              </h2>
              <div className="space-y-4 text-[#1A1A1A]/70 font-sans leading-relaxed">
                <p>
                  Vi arbejder udelukkende med materialer af høj kvalitet, der tåler
                  tidens tand. Vores sterlingsølv-stykker er fremstillet af
                  92,5% rent sølv, mens vores guldsmykker indeholder 14 karat og 18 karat
                  guldforgyldning over en sterlingsølv-base.
                </p>
                <p>
                  Hver ædelsten er omhyggeligt udvalgt for sin kvalitet og
                  brillans. Vi sourcer ferskvandsperler fra bæredygtige dambrug
                  og bruger konfliktfrie ædelstene i hele vores
                  kollektioner.
                </p>
                <p>
                  Alle vores smykker er hypoallergene og nikkelfri, hvilket gør dem
                  perfekte selv til den mest følsomme hud.
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
                alt="Yunik smykkematerialer"
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
              Bæredygtighed
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-8">
              Vores Løfte
            </h2>
            <div className="space-y-6 text-white/70 font-sans leading-relaxed text-lg">
              <p>
                Vi tror på, at smukke smykker ikke skal koste vores planet.
                Derfor er vi engagerede i bæredygtige praksisser i hvert trin
                af vores proces.
              </p>
              <p>
                Fra genbrugelige emballagematerialer til etisk sourcede ædelstene bestræber
                vi os på at minimere vores miljøaftryk, samtidig med at vi maksimerer
                skønheden og kvaliteten af vores smykker.
              </p>
              <p>
                Vores smykker er designet til at holde livet ud, hvilket reducerer behovet
                for konstant udskiftning og bidrager til en mere bæredygtig
                modeindustri.
              </p>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
