"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

export default function TermsPage() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-[#F5F0EB] py-16 md:py-20">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl font-light text-[#1A1A1A] mb-4">
              Handelsbetingelser
            </h1>
            <p className="text-[#1A1A1A]/60 font-sans">
              Sidst opdateret: Februar 2025
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Content */}
      <section className="py-16 md:py-20">
        <Container size="narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="prose prose-lg max-w-none font-sans text-[#1A1A1A]/80"
          >
            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              1. Generelle oplysninger
            </h2>
            <p>
              <strong>Virksomhed:</strong> Yunik<br />
              <strong>CVR:</strong> [UDFYLD CVR-NUMMER]<br />
              <strong>Adresse:</strong> [UDFYLD ADRESSE]<br />
              <strong>Email:</strong> kontakt@yunik.dk<br />
              <strong>Telefon:</strong> [UDFYLD TELEFON]
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              2. Priser og betaling
            </h2>
            <p>
              Alle priser på yunik.dk er angivet i danske kroner (DKK) inklusiv moms.
            </p>
            <p>Vi accepterer følgende betalingsmetoder:</p>
            <ul>
              <li>Kreditkort (Visa, Mastercard)</li>
              <li>MobilePay</li>
              <li>Bankoverførsel</li>
            </ul>
            <p>
              Beløbet trækkes først, når varen afsendes. Ved forudbestilling kan
              beløbet dog trækkes ved bestilling.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              3. Levering
            </h2>
            <p>
              Vi leverer til hele Danmark og udvalgte europæiske lande.
              Leveringstiden er typisk 3-5 hverdage inden for Danmark.
            </p>
            <p>
              <strong>Fragtpriser:</strong>
            </p>
            <ul>
              <li>Gratis fragt ved køb over 500 DKK</li>
              <li>Standardfragt: 39 DKK</li>
              <li>Ekspreslevering: 79 DKK (1-2 hverdage)</li>
            </ul>
            <p>
              Du modtager en email med tracking-information, når din ordre er afsendt.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              4. Fortrydelsesret
            </h2>
            <p>
              Du har 14 dages fortrydelsesret i henhold til forbrugeraftaleloven.
              Fristen regnes fra den dag, du modtager varen.
            </p>
            <p>For at benytte fortrydelsesretten skal du:</p>
            <ul>
              <li>Give os besked inden 14 dage (email til kontakt@yunik.dk)</li>
              <li>Returnere varen inden 14 dage efter du har givet besked</li>
              <li>Varen skal være i ubrugt og original stand</li>
            </ul>
            <p>
              Du betaler selv returfragt. Vi refunderer købsbeløbet inden 14 dage
              efter modtagelse af returvaren.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              5. Reklamationsret
            </h2>
            <p>
              Du har 2 års reklamationsret i henhold til købeloven. Det betyder,
              at du kan få repareret, ombyttet, pengene tilbage eller afslag i prisen,
              hvis varen har en mangel.
            </p>
            <p>
              Reklamationen skal ske inden rimelig tid efter, at du har opdaget manglen.
              Kontakt os på kontakt@yunik.dk.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              6. Garanti
            </h2>
            <p>
              Udover din lovbestemte reklamationsret yder vi 1 års garanti på alle
              vores smykker mod fabrikationsfejl. Garantien dækker ikke:
            </p>
            <ul>
              <li>Normal slitage</li>
              <li>Skader forårsaget af forkert brug eller pleje</li>
              <li>Skader fra kemikalier, parfume eller vand</li>
            </ul>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              7. Persondata
            </h2>
            <p>
              Vi behandler dine personoplysninger i overensstemmelse med GDPR.
              Læs vores fulde privatlivspolitik for mere information.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              8. Immaterielle rettigheder
            </h2>
            <p>
              Alt indhold på yunik.dk, herunder tekst, billeder, logoer og design,
              er beskyttet af ophavsret og tilhører Yunik. Uautoriseret brug er forbudt.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              9. Ansvarsfraskrivelse
            </h2>
            <p>
              Vi bestræber os på at holde alle produktoplysninger opdaterede, men
              tager forbehold for trykfejl, prisændringer og udsolgte varer.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              10. Tvister
            </h2>
            <p>
              Ved uenighed kan du klage til Nævnenes Hus:
            </p>
            <p>
              <strong>Nævnenes Hus</strong><br />
              Toldboden 2<br />
              8800 Viborg<br />
              naevneneshus.dk
            </p>
            <p>
              Du kan også benytte EU-Kommissionens online klageportal:
              ec.europa.eu/odr
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              11. Lovvalg
            </h2>
            <p>
              Disse handelsbetingelser er underlagt dansk ret, og eventuelle tvister
              skal afgøres ved de danske domstole.
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
