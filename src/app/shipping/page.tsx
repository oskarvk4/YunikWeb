import type { Metadata } from "next";
import Container from "@/components/ui/Container";
import FadeIn from "@/components/ui/FadeIn";
import {
  SHIPPING_OPTION_LIST,
  formatDeliveryEstimate,
  formatShippingPrice,
} from "@/constants/shipping";

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
              <div className="grid md:grid-cols-3 gap-6">
                {SHIPPING_OPTION_LIST.map((option) => (
                  <div key={option.key} className="p-6 bg-[#F5F0EB] rounded-sm">
                    <h3 className="font-serif text-lg font-medium text-[#1A1A1A] mb-2">
                      {option.label}
                    </h3>
                    <p className="text-3xl font-serif text-[#8D6553] mb-2">
                      {formatShippingPrice(option)}
                    </p>
                    <p className="text-[#1A1A1A]/60 font-sans text-sm">
                      {option.description}
                    </p>
                    <p className="text-[#1A1A1A]/60 font-sans text-sm mt-1">
                      {formatDeliveryEstimate(option)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-6 bg-[#1A1A1A] text-white rounded-sm">
                <p className="font-serif text-lg mb-1">Altid gratis fragt</p>
                <p className="text-white/70 font-sans text-sm">
                  Både pakkeshop og levering til døren er gratis på alle ordrer
                  — uanset beløb. Kun ekspres koster ekstra.
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
                      <th className="text-left py-3 font-medium text-[#1A1A1A]">Fragtmulighed</th>
                      <th className="text-left py-3 font-medium text-[#1A1A1A]">Pris</th>
                      <th className="text-left py-3 font-medium text-[#1A1A1A]">Leveringstid</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#1A1A1A]/70">
                    {SHIPPING_OPTION_LIST.map((option) => (
                      <tr
                        key={option.key}
                        className="border-b border-[#1A1A1A]/10"
                      >
                        <td className="py-3">{option.label}</td>
                        <td className="py-3">{formatShippingPrice(option)}</td>
                        <td className="py-3">
                          {formatDeliveryEstimate(option)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-4 text-sm text-[#1A1A1A]/60 font-sans">
                * Vi sender kun til danske adresser. Leveringstider er estimater og kan
                variere pga. helligdage eller uforudsete forsinkelser.
              </p>
            </div>

            {/* Parcel shop */}
            <div>
              <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mb-4">
                Levering til pakkeshop
              </h2>
              <p className="text-[#1A1A1A]/70 font-sans leading-relaxed">
                Vælger du pakkeshop, viser vi dig shops nær din adresse, så snart
                din ordre er gennemført — og du vælger selv, hvilken du vil hente
                i. Du får besked fra fragtføreren, når pakken er klar til
                afhentning.
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
