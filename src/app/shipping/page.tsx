import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";

export const metadata: Metadata = {
  title: "Levering",
  description: "Alt om levering hos Yunik — leveringstider, fragtpriser og sporingsinfo. Gratis standardfragt og express-mulighed.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <FadeIn inView={false} duration={0.6} className="text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              Levering
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              Alt du behøver at vide om fragt og levering
            </p>
          </FadeIn>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <FadeIn inView={false} duration={0.6} delay={0.2} className="space-y-12">
            {/* Shipping Options */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                Fragtmuligheder
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#F5F0EB] rounded-sm">
                  <h3 className="font-serif text-lg font-medium text-[#1A1A1A] mb-2">
                    Standardlevering
                  </h3>
                  <p className="text-3xl font-serif text-[#8D6553] mb-2">39 DKK</p>
                  <p className="text-[#1A1A1A]/60 font-sans text-sm">
                    Levering inden for 3-5 hverdage
                  </p>
                </div>
                <div className="p-6 bg-[#F5F0EB] rounded-sm">
                  <h3 className="font-serif text-lg font-medium text-[#1A1A1A] mb-2">
                    Ekspreslevering
                  </h3>
                  <p className="text-3xl font-serif text-[#8D6553] mb-2">79 DKK</p>
                  <p className="text-[#1A1A1A]/60 font-sans text-sm">
                    Levering inden for 1-2 hverdage
                  </p>
                </div>
              </div>
              <div className="mt-6 p-6 bg-[#1A1A1A] text-white rounded-sm">
                <p className="font-serif text-lg mb-1">Gratis fragt</p>
                <p className="text-white/70 font-sans text-sm">
                  Ved køb over 500 DKK får du gratis standardlevering
                </p>
              </div>
            </div>

            {/* Delivery Times */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-6">
                Leveringstider
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full font-sans text-sm">
                  <thead>
                    <tr className="border-b border-[#1A1A1A]/10">
                      <th className="text-left py-3 font-medium text-[#1A1A1A]">Destination</th>
                      <th className="text-left py-3 font-medium text-[#1A1A1A]">Standard</th>
                      <th className="text-left py-3 font-medium text-[#1A1A1A]">Ekspres</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#1A1A1A]/70">
                    <tr className="border-b border-[#1A1A1A]/10">
                      <td className="py-3">Danmark</td>
                      <td className="py-3">3-5 hverdage</td>
                      <td className="py-3">1-2 hverdage</td>
                    </tr>
                    <tr className="border-b border-[#1A1A1A]/10">
                      <td className="py-3">Sverige, Norge</td>
                      <td className="py-3">5-7 hverdage</td>
                      <td className="py-3">3-4 hverdage</td>
                    </tr>
                    <tr className="border-b border-[#1A1A1A]/10">
                      <td className="py-3">Tyskland</td>
                      <td className="py-3">5-7 hverdage</td>
                      <td className="py-3">3-4 hverdage</td>
                    </tr>
                    <tr className="border-b border-[#1A1A1A]/10">
                      <td className="py-3">Øvrige EU</td>
                      <td className="py-3">7-10 hverdage</td>
                      <td className="py-3">5-7 hverdage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-[#1A1A1A]/60 font-sans">
                * Leveringstider er estimater og kan variere pga. helligdage eller uforudsete forsinkelser.
              </p>
            </div>

            {/* Tracking */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                Sporing af din ordre
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed">
                Når din ordre er afsendt, modtager du en email med et tracking-nummer.
                Du kan følge din pakke hele vejen fra vores lager til din dør.
              </p>
            </div>

            {/* Packaging */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                Emballage
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed mb-4">
                Alle smykker leveres i vores elegante Yunik-emballage:
              </p>
              <ul className="space-y-2 text-[#1A1A1A]/70 font-sans">
                <li className="flex items-start gap-3">
                  <span className="text-[#8D6553]">•</span>
                  <span>Smykkeboks med silkeforet interiør</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8D6553]">•</span>
                  <span>Plejekort med vedligeholdelsesinstruktioner</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#8D6553]">•</span>
                  <span>Gaveklar præsentation</span>
                </li>
              </ul>
            </div>

            {/* Questions */}
            <div className="p-6 bg-[#F5F0EB] rounded-sm">
              <h2 className="font-serif text-xl font-light text-[#1A1A1A] mb-3">
                Har du spørgsmål?
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans mb-4">
                Kontakt os på kontakt@yunik.dk, så hjælper vi dig gerne.
              </p>
              <a
                href="/contact"
                className="inline-block text-[#8D6553] font-sans text-sm hover:underline"
              >
                Gå til kontaktsiden →
              </a>
            </div>
          </FadeIn>
        </Container>
      </section>
    </div>
  );
}
