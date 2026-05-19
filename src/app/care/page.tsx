import Image from "next/image";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";

export default function CarePage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <FadeIn inView={false} duration={0.6} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              Plejeguide
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              Sådan holder du dine smykker smukke i mange år
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
                Generel pleje
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#8D6553]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Tag smykker af</h3>
                      <p className="text-[#1A1A1A]/70 font-sans text-sm">
                        Før bad, svømning, sport og søvn. Vand og sved kan påvirke metallerne.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#8D6553]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Undgå kemikalier</h3>
                      <p className="text-[#1A1A1A]/70 font-sans text-sm">
                        Parfume, hårlak, cremer og rengøringsmidler kan skade overfladen.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#8D6553]/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-[#1A1A1A] mb-1">Sidste på, først af</h3>
                      <p className="text-[#1A1A1A]/70 font-sans text-sm">
                        Tag smykker på til sidst og tag dem af først for at beskytte dem.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="relative aspect-square bg-[#F5F0EB] rounded-sm overflow-hidden">
                  <Image
                    src="/yunik-17.webp"
                    alt="Smykkepleje"
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
                Opbevaring
              </h2>
              <div className="p-8 bg-[#F5F0EB] rounded-sm">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">Separat opbevaring</h3>
                    <p className="text-[#1A1A1A]/70 font-sans text-sm">
                      Opbevar hvert smykke for sig for at undgå ridser
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">Tørt miljø</h3>
                    <p className="text-[#1A1A1A]/70 font-sans text-sm">
                      Fugt kan forårsage oxidering og misfarvning
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-[#8D6553]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] mb-2">Væk fra sollys</h3>
                    <p className="text-[#1A1A1A]/70 font-sans text-sm">
                      Direkte sollys kan falme visse materialer
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Material-specific care */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                Materialespecifik pleje
              </h2>
              <div className="space-y-6">
                <div className="p-6 border border-[#1A1A1A]/10 rounded-sm">
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-3">Sterlingsølv</h3>
                  <p className="text-[#1A1A1A]/70 font-sans mb-3">
                    Sølv kan oxidere og blive mørkere over tid. Dette er naturligt og kan let fjernes.
                  </p>
                  <ul className="space-y-1 text-[#1A1A1A]/70 font-sans text-sm">
                    <li>• Puds regelmæssigt med en blød klud</li>
                    <li>• Brug en sølvpudseklud ved misfarvning</li>
                    <li>• Undgå at bruge tandpasta eller andre skuremidler</li>
                  </ul>
                </div>
                <div className="p-6 border border-[#1A1A1A]/10 rounded-sm">
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-3">Guldbelagt</h3>
                  <p className="text-[#1A1A1A]/70 font-sans mb-3">
                    Guldbelægning er smukt men kræver ekstra opmærksomhed for at bevare glansen.
                  </p>
                  <ul className="space-y-1 text-[#1A1A1A]/70 font-sans text-sm">
                    <li>• Puds forsigtigt med en blød, tør klud</li>
                    <li>• Undgå at gnide for hårdt</li>
                    <li>• Hold væk fra vand og fugt</li>
                  </ul>
                </div>
                <div className="p-6 border border-[#1A1A1A]/10 rounded-sm">
                  <h3 className="font-serif text-lg text-[#1A1A1A] mb-3">Perler</h3>
                  <p className="text-[#1A1A1A]/70 font-sans mb-3">
                    Perler er organiske og særligt følsomme over for kemikalier og udtørring.
                  </p>
                  <ul className="space-y-1 text-[#1A1A1A]/70 font-sans text-sm">
                    <li>• Tør af med en fugtig klud efter brug</li>
                    <li>• Opbevar adskilt fra andre smykker</li>
                    <li>• Undgå parfume og hårlak direkte på perler</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Cleaning */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                Rengøring derhjemme
              </h2>
              <div className="prose prose-lg max-w-none font-sans text-[#1A1A1A]/80">
                <p>
                  Til let rengøring kan du bruge en blød klud let fugtet med vand og mild sæbe.
                  Tør grundigt af bagefter.
                </p>
                <p className="font-medium text-[#1A1A1A]">
                  Vigtigt: Nedsænk aldrig smykker i vand, især ikke dem med sten eller perler.
                </p>
              </div>
            </div>

            {/* Need help */}
            <div className="p-8 bg-[#1A1A1A] text-white rounded-sm text-center">
              <h3 className="font-serif text-xl mb-3">Brug for hjælp?</h3>
              <p className="text-white/70 font-sans mb-6">
                Har du spørgsmål om pleje af dit specifikke smykke?
                Vi hjælper gerne.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-[#1A1A1A] font-sans text-sm uppercase tracking-wider hover:bg-[#F5F0EB] transition-colors"
              >
                Kontakt Os
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
