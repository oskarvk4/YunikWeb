import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import { getCopy } from "@/lib/copy";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = (await getCopy()).care;
  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: "/care" },
  };
}

export default async function CarePage() {
  const copy = (await getCopy()).care;

  const generalTips = [
    { title: copy.general.tip1Title, body: copy.general.tip1Body },
    { title: copy.general.tip2Title, body: copy.general.tip2Body },
    { title: copy.general.tip3Title, body: copy.general.tip3Body },
  ];

  const materialCare = [
    {
      title: copy.silver.title,
      body: copy.silver.body,
      tips: [copy.silver.tip1, copy.silver.tip2, copy.silver.tip3],
    },
    {
      title: copy.gold.title,
      body: copy.gold.body,
      tips: [copy.gold.tip1, copy.gold.tip2, copy.gold.tip3],
    },
    {
      title: copy.pearls.title,
      body: copy.pearls.body,
      tips: [copy.pearls.tip1, copy.pearls.tip2, copy.pearls.tip3],
    },
  ];

  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <FadeIn inView={false} duration={0.6} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              {copy.header.headline}
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              {copy.header.subhead}
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <FadeIn inView={false} duration={0.6} delay={0.2} className="space-y-16">
            {/* General Care */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                {copy.general.headline}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  {generalTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#8D6553]/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">{tip.title}</h3>
                        <p className="text-[#1A1A1A]/70 font-sans text-sm">
                          {tip.body}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="relative aspect-square bg-[#F5F0EB] rounded-sm overflow-hidden">
                  <Image
                    src="/jewelry-close-up.webp"
                    alt={copy.general.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>

            {/* Storage */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                {copy.storage.headline}
              </h2>
              <div className="p-8 bg-[#F5F0EB] rounded-sm">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">{copy.storage.item1Title}</h3>
                    <p className="text-[#1A1A1A]/70 font-sans text-sm">
                      {copy.storage.item1Body}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">{copy.storage.item2Title}</h3>
                    <p className="text-[#1A1A1A]/70 font-sans text-sm">
                      {copy.storage.item2Body}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">{copy.storage.item3Title}</h3>
                    <p className="text-[#1A1A1A]/70 font-sans text-sm">
                      {copy.storage.item3Body}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Material-specific care */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                {copy.materials.headline}
              </h2>
              {/* One fold-out per material, closed by default, so the section stays short. */}
              <div className="border-t border-[#1A1A1A]/10">
                {materialCare.map((material, index) => (
                  <details key={index} className="group border-b border-[#1A1A1A]/10">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-serif text-lg text-[#1A1A1A]">{material.title}</h3>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={1.5}
                        className="h-5 w-5 shrink-0 text-[#1A1A1A]/60 transition-transform duration-300 group-open:rotate-180"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
                      </svg>
                    </summary>
                    <div className="pb-6">
                      <p className="text-[#1A1A1A]/70 font-sans mb-3">{material.body}</p>
                      <ul className="space-y-1 text-[#1A1A1A]/70 font-sans text-sm">
                        {material.tips.map((tip, tipIndex) => (
                          <li key={tipIndex}>{`• ${tip}`}</li>
                        ))}
                      </ul>
                    </div>
                  </details>
                ))}
              </div>
            </div>

            {/* Cleaning */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                {copy.cleaning.headline}
              </h2>
              <div className="prose prose-lg max-w-none font-sans text-[#1A1A1A]/80">
                <p>{copy.cleaning.body}</p>
                <p className="font-medium text-[#1A1A1A]">
                  {copy.cleaning.important}
                </p>
              </div>
            </div>

            {/* Need help */}
            <div className="p-8 bg-[#1A1A1A] text-white rounded-sm text-center">
              <h3 className="font-serif text-xl mb-3">{copy.help.headline}</h3>
              <p className="text-white/70 font-sans mb-6">
                {copy.help.body}
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-[#1A1A1A] font-sans text-sm uppercase tracking-wider hover:bg-[#F5F0EB] transition-colors"
              >
                {copy.help.button}
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
