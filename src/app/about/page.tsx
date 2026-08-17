import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { getCopy } from "@/lib/copy";

export const metadata: Metadata = {
  title: "Vores Historie",
  description: "Lær Yunik at kende — håndlavede smykker skabt med inspiration fra 30 års rejser mellem Danmark, Indien og Thailand. Skandinavisk design møder globale traditioner.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Vores Historie | Yunik",
    description: "Lær Yunik at kende — håndlavede smykker skabt med inspiration fra 30 års rejser.",
    images: [{ url: "/yunik-17.webp", width: 1200, height: 800, alt: "Yunik smykker" }],
  },
};

export default async function AboutPage() {
  const copy = (await getCopy()).about;
  const values = [
    { title: copy.values.title1, description: copy.values.body1 },
    { title: copy.values.title2, description: copy.values.body2 },
    { title: copy.values.title3, description: copy.values.body3 },
  ];

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
          <FadeIn inView={false} className="text-center px-4">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-light text-white mb-4">
              {copy.hero.headline}
            </h1>
            <p className="text-white/80 font-sans text-lg max-w-md mx-auto">
              {copy.hero.subhead}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-28 bg-white">
        <Container size="narrow">
          <FadeIn className="text-center mb-16">
            <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#8D6553] mb-4">
              {copy.story.kicker}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-8">
              {copy.story.headline}
            </h2>
            <div className="space-y-6 text-[#1A1A1A]/70 font-sans leading-relaxed text-lg">
              <p>{copy.story.paragraph1}</p>
              <p>{copy.story.paragraph2}</p>
            </div>
          </FadeIn>
        </Container>
      </section>

      {/* Heritage band — collected through decades */}
      <section className="relative h-[70vh] min-h-[480px] max-h-[720px] overflow-hidden">
        <Image
          src="/StoryPics/travel.webp"
          alt="Pas, telefon og smykker — samlet over årtiers rejser"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <FadeIn className="text-center max-w-2xl">
            <p className="text-xs font-sans uppercase tracking-[0.4em] text-white/70 mb-5">
              {copy.heritage.kicker}
            </p>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl font-light text-white leading-snug">
              {copy.heritage.body}
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Image Break */}
      <section className="relative">
        <div className="grid md:grid-cols-2">
          <FadeIn direction="left" className="relative aspect-square md:aspect-[4/3]">
            <Image
              src="/yunik-11.jpg"
              alt="Yunik smykkehåndværk"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </FadeIn>
          <FadeIn direction="right" delay={0.2} className="relative aspect-square md:aspect-[4/3]">
            <Image
              src="/yunik-12.jpg"
              alt="Yunik smykkedetaljer"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </FadeIn>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 md:py-28 bg-[#F5F0EB]">
        <Container>
          <FadeIn duration={0.6} className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A]">
              {copy.values.headline}
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            {values.map((value, index) => (
              <FadeIn
                key={value.title}
                duration={0.6}
                delay={index * 0.1}
                className="text-center"
              >
                <h3 className="font-serif text-xl font-medium text-[#1A1A1A] mb-4">
                  {value.title}
                </h3>
                <p className="text-[#1A1A1A]/70 font-sans leading-relaxed">
                  {value.description}
                </p>
              </FadeIn>
            ))}
          </div>
        </Container>
      </section>

      {/* Materials Section */}
      <section id="materials" className="py-20 md:py-28 bg-white">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <FadeIn direction="left">
              <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#8D6553] mb-4">
                {copy.materials.kicker}
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A] mb-6">
                {copy.materials.headline}
              </h2>
              <div className="space-y-4 text-[#1A1A1A]/70 font-sans leading-relaxed">
                <p>{copy.materials.paragraph1}</p>
                <p>{copy.materials.paragraph2}</p>
                <p>{copy.materials.paragraph3}</p>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.2} className="relative aspect-square">
              <Image
                src="/yunik-17.webp"
                alt="Yunik smykkematerialer"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </FadeIn>
          </div>
        </Container>
      </section>

      {/* Sustainability Section */}
      <section id="sustainability" className="py-20 md:py-28 bg-[#1A1A1A]">
        <Container size="narrow">
          <FadeIn className="text-center">
            <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#D4A9A5] mb-4">
              {copy.sustainability.kicker}
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light text-white mb-8">
              {copy.sustainability.headline}
            </h2>
            <div className="space-y-6 text-white/70 font-sans leading-relaxed text-lg">
              <p>{copy.sustainability.paragraph1}</p>
              <p>{copy.sustainability.paragraph2}</p>
              <p>{copy.sustainability.paragraph3}</p>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
