// Default text for editable site copy.
// The admin editor at /admin/copy shows every string in this tree.
// Overrides are stored in the `site_copy` Supabase table and merged
// on top of these defaults by getCopy() in src/lib/copy.ts.
//
// To make more copy editable: add a field here, then read it via
// `const copy = await getCopy(); copy.section.key`.

export const defaultCopy = {
  home: {
    hero: {
      kicker: "Håndlavet med Kærlighed",
      headlineLine1: "Tidløs",
      headlineLine2: "Elegance",
      body: "Opdag smykker der fejrer din unikke historie. Hvert stykke er skabt til at blive en værdsat del af din rejse.",
      cta: "Se Kollektionen",
    },
  },
  about: {
    hero: {
      headline: "Vores Historie",
      subhead: "Skaber tidløs elegance fra begyndelsen",
    },
    story: {
      kicker: "Om Yunik",
      headline: "Fejrer Individualitet",
      paragraph1:
        "Yunik blev født af en simpel overbevisning: at alle fortjener smykker lige så unikke som dem selv. Vores navn—afledt af \"unique\"—afspejler vores engagement i at skabe stykker, der fejrer individualitet og personligt udtryk.",
      paragraph2:
        "Grundlagt i Danmark trækker vi inspiration fra skandinaviske design principper: rene linjer, omhyggeligt håndværk og en dyb respekt for materialer. Hvert smykke i vores kollektion fortæller en historie om nøje overvejelse og kunstnerisk vision.",
    },
    heritage: {
      kicker: "Et familiearkiv",
      body: "Samlet gennem 30 år af rejser mellem Danmark, Indien og Thailand.",
    },
    values: {
      headline: "Vores Værdier",
      title1: "Kvalitetshåndværk",
      body1:
        "Hvert smykke er omhyggeligt fremstillet ved hjælp af traditionelle teknikker og de fineste materialer, hvilket sikrer varig skønhed og holdbarhed.",
      title2: "Tidløst Design",
      body2:
        "Vores designs transcenderer trends og skaber stykker, der bliver elskede dele af din smykkesamling i mange år fremover.",
      title3: "Bæredygtig Praksis",
      body3:
        "Vi er engagerede i etisk sourcing og bæredygtige produktionsmetoder, fordi smukke smykker ikke skal koste jorden.",
    },
    materials: {
      kicker: "Materialer",
      headline: "Skabt med Omhu",
      paragraph1:
        "Vi arbejder udelukkende med materialer af høj kvalitet, der tåler tidens tand. Vores sterlingsølv-stykker er fremstillet af 92,5% rent sølv, mens vores guldsmykker indeholder 14 karat og 18 karat guldforgyldning over en sterlingsølv-base.",
      paragraph2:
        "Hver ædelsten er omhyggeligt udvalgt for sin kvalitet og brillans. Vi sourcer ferskvandsperler fra bæredygtige dambrug og bruger konfliktfrie ædelstene i hele vores kollektioner.",
      paragraph3:
        "Alle vores smykker er hypoallergene og nikkelfri, hvilket gør dem perfekte selv til den mest følsomme hud.",
    },
    sustainability: {
      kicker: "Bæredygtighed",
      headline: "Vores Løfte",
      paragraph1:
        "Vi tror på, at smukke smykker ikke skal koste vores planet. Derfor er vi engagerede i bæredygtige praksisser i hvert trin af vores proces.",
      paragraph2:
        "Fra genbrugelige emballagematerialer til etisk sourcede ædelstene bestræber vi os på at minimere vores miljøaftryk, samtidig med at vi maksimerer skønheden og kvaliteten af vores smykker.",
      paragraph3:
        "Vores smykker er designet til at holde livet ud, hvilket reducerer behovet for konstant udskiftning og bidrager til en mere bæredygtig modeindustri.",
    },
  },
  contact: {
    header: {
      headline: "Kontakt Os",
      subhead: "Vi svarer typisk inden for 24 timer",
    },
    info: {
      headline: "Kom i kontakt",
      body: "Har du spørgsmål om en ordre, et produkt eller noget helt tredje? Vi er her for at hjælpe dig.",
      emailLabel: "Email",
      email: "kontakt@yunik.dk",
      responseLabel: "Svartid",
      responseBody: "Vi svarer inden for 24 timer på hverdage",
      addressLabel: "Adresse",
      addressLine1: "Silkeborgvej 226",
      addressLine2: "8320 Åbyhøj, Danmark",
    },
    faqBox: {
      title: "Hurtige svar",
      body: "Find måske svaret i vores FAQ",
      cta: "Gå til FAQ →",
    },
    form: {
      kicker: "Kontaktformular",
      headline: "Skriv direkte til os",
      body: "Din besked bliver sendt direkte til vores indbakke. Brug gerne så mange detaljer som muligt.",
      nameLabel: "Navn",
      namePlaceholder: "Dit fulde navn",
      emailLabel: "Email",
      emailPlaceholder: "din@email.dk",
      subjectLabel: "Emne",
      subjectPlaceholder: "Vælg et emne",
      subjectOrder: "Spørgsmål om ordre",
      subjectProduct: "Spørgsmål om produkt",
      subjectReturn: "Returnering/bytte",
      subjectOther: "Andet",
      messageLabel: "Besked",
      messagePlaceholder:
        "Fortæl os gerne om ordrenummer, produktnavn eller andre detaljer...",
      privacyNote:
        "Vi bruger oplysningerne til at besvare din henvendelse og deler dem ikke med tredjepart uden grund.",
      submit: "Send Besked",
      submitting: "Sender...",
      successMessage: "Tak for din besked! Vi vender tilbage hurtigst muligt.",
      defaultError:
        "Der opstod en fejl. Prøv igen eller send en email direkte.",
    },
  },
} as const;

export type Copy = {
  [K in keyof typeof defaultCopy]: {
    [S in keyof (typeof defaultCopy)[K]]: {
      [F in keyof (typeof defaultCopy)[K][S]]: string;
    };
  };
};
