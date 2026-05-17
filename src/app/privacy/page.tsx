"use client";

import { motion } from "framer-motion";
import Container from "@/components/ui/Container";

export default function PrivacyPage() {
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
              Privatlivspolitik
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
              1. Dataansvarlig
            </h2>
            <p>
              Yunik er dataansvarlig for behandlingen af de personoplysninger, som vi modtager om dig.
            </p>
            <p>
              <strong>Virksomhed:</strong> Yunik Jewelry<br />
              <strong>CVR:</strong> 46331060<br />
              <strong>Adresse:</strong> Silkeborgvej 226, 8320 Åbyhøj<br />
              <strong>Email:</strong> kontakt@yunik.dk
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              2. Hvilke oplysninger indsamler vi?
            </h2>
            <p>Vi indsamler og behandler følgende typer personoplysninger:</p>
            <ul>
              <li><strong>Kontaktoplysninger:</strong> Navn, email, telefonnummer, leveringsadresse</li>
              <li><strong>Ordreoplysninger:</strong> Købshistorik, betalingsoplysninger (vi gemmer ikke kortoplysninger)</li>
              <li><strong>Kommunikation:</strong> Henvendelser via email eller kontaktformular</li>
              <li><strong>Tekniske data:</strong> IP-adresse, browsertype, besøgsdata via cookies</li>
            </ul>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              3. Formål med behandlingen
            </h2>
            <p>Vi behandler dine personoplysninger til følgende formål:</p>
            <ul>
              <li>At levere de varer, du har bestilt</li>
              <li>At kommunikere med dig om din ordre</li>
              <li>At sende nyhedsbreve (kun hvis du har tilmeldt dig)</li>
              <li>At forbedre vores hjemmeside og kundeservice</li>
              <li>At overholde lovkrav (bogføring, garanti mv.)</li>
            </ul>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              4. Retsgrundlag
            </h2>
            <p>Vi behandler dine oplysninger på følgende retsgrundlag:</p>
            <ul>
              <li><strong>Kontrakt:</strong> For at opfylde vores aftale med dig (leverance af varer)</li>
              <li><strong>Samtykke:</strong> Til nyhedsbreve og markedsføring</li>
              <li><strong>Legitime interesser:</strong> Til at forbedre vores tjenester</li>
              <li><strong>Lovkrav:</strong> Bogføringsloven kræver opbevaring i 5 år</li>
            </ul>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              5. Opbevaringsperiode
            </h2>
            <p>
              Vi opbevarer dine personoplysninger så længe, det er nødvendigt for de formål,
              de blev indsamlet til:
            </p>
            <ul>
              <li>Ordredata: 5 år (bogføringsloven)</li>
              <li>Nyhedsbrevstilmelding: Indtil du afmelder dig</li>
              <li>Kundeservicehenvendelser: 2 år</li>
            </ul>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              6. Dine rettigheder
            </h2>
            <p>Du har følgende rettigheder i henhold til GDPR:</p>
            <ul>
              <li><strong>Indsigt:</strong> Du kan få oplyst, hvilke data vi har om dig</li>
              <li><strong>Berigtigelse:</strong> Du kan få rettet forkerte oplysninger</li>
              <li><strong>Sletning:</strong> Du kan i visse tilfælde få slettet dine data</li>
              <li><strong>Begrænsning:</strong> Du kan bede om begrænset behandling</li>
              <li><strong>Dataportabilitet:</strong> Du kan få udleveret dine data</li>
              <li><strong>Indsigelse:</strong> Du kan gøre indsigelse mod behandling</li>
            </ul>
            <p>
              Kontakt os på kontakt@yunik.dk for at udøve dine rettigheder.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              7. Cookies
            </h2>
            <p>
              Vi bruger cookies til at forbedre din oplevelse på vores hjemmeside.
              Se vores cookie-politik for mere information om, hvilke cookies vi bruger.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              8. Tredjeparter
            </h2>
            <p>Vi deler kun dine oplysninger med betroede tredjeparter:</p>
            <ul>
              <li>Betalingsudbydere (til sikker betalingsbehandling)</li>
              <li>Fragtfirmaer (til levering af din ordre)</li>
              <li>Email-tjenester (til nyhedsbreve, kun med dit samtykke)</li>
            </ul>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              9. Sikkerhed
            </h2>
            <p>
              Vi tager datasikkerhed alvorligt og bruger passende tekniske og organisatoriske
              foranstaltninger til at beskytte dine personoplysninger mod uautoriseret adgang,
              tab eller misbrug.
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              10. Klager
            </h2>
            <p>
              Hvis du er utilfreds med vores behandling af dine personoplysninger, kan du
              klage til Datatilsynet:
            </p>
            <p>
              <strong>Datatilsynet</strong><br />
              Carl Jacobsens Vej 35<br />
              2500 Valby<br />
              dt@datatilsynet.dk
            </p>

            <h2 className="font-serif text-2xl font-light text-[#1A1A1A] mt-8 mb-4">
              11. Ændringer
            </h2>
            <p>
              Vi forbeholder os retten til at opdatere denne privatlivspolitik.
              Ved væsentlige ændringer vil vi informere dig via email eller på vores hjemmeside.
            </p>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
