// Om Yunik (/about).

export const aboutCopy = {
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
    },
    materials: {
      kicker: "Materialer",
      headline: "Skabt med Omhu",
      paragraph1:
        "Vi arbejder udelukkende med materialer af høj kvalitet, der tåler tidens tand. Vores sterlingsølv-stykker er fremstillet af 92,5% rent sølv, mens vores guldsmykker indeholder 14 karat og 18 karat guldforgyldning over en sterlingsølv-base.",
      paragraph2:
        "Hver ædelsten er omhyggeligt udvalgt for sin kvalitet og brillans.",
      paragraph3:
        "Alle vores smykker er hypoallergene og nikkelfri, hvilket gør dem perfekte selv til den mest følsomme hud.",
    },
    images: {
      heroAlt: "Yunik smykkekollektion",
      heritageAlt: "Pas, telefon og smykker — samlet over årtiers rejser",
      standAlt: "Yuniks stand med sten, smykker og tøj, set ovenfra",
      messeAlt: "Manden bag Yunik ved standen på en messe",
      materialsAlt: "Yunik smykkematerialer",
    },
    metadata: {
      title: "Vores Historie",
      description:
        "Lær Yunik at kende — håndlavede smykker skabt med inspiration fra 30 års rejser mellem Danmark, Indien og Thailand. Skandinavisk design møder globale traditioner.",
      shareTitle: "Vores Historie | Yunik",
      shareDescription:
        "Lær Yunik at kende — håndlavede smykker skabt med inspiration fra 30 års rejser.",
      shareImageAlt: "Yunik smykker",
    },
  },
} as const;

/** Section titles in /admin/copy, keyed "page.section". */
export const aboutTitles: Record<string, string> = {
  "about.hero": "Om os – Hero",
  "about.story": "Om os – Vores historie",
  "about.heritage": "Om os – Familiearkiv (billedbånd)",
  "about.values": "Om os – Vores værdier",
  "about.materials": "Om os – Materialer",
  "about.images": "Om os – Billedtekster (skærmlæsere og Google)",
  "about.metadata": "Om os – Titel og beskrivelse (fane, Google og deling)",
};

/** Field labels in /admin/copy, keyed "page.section.field". Unlisted fields get a label from their key. */
export const aboutLabels: Record<string, string> = {
  "about.hero.headline": "Overskrift",
  "about.hero.subhead": "Undertitel",
  "about.story.kicker": "Overtitel",
  "about.story.headline": "Overskrift",
  "about.story.paragraph1": "Afsnit 1",
  "about.story.paragraph2": "Afsnit 2",
  "about.heritage.kicker": "Overtitel",
  "about.heritage.body": "Citat",
  "about.values.headline": "Overskrift",
  "about.values.title1": "Værdi 1 – titel",
  "about.values.body1": "Værdi 1 – beskrivelse",
  "about.values.title2": "Værdi 2 – titel",
  "about.values.body2": "Værdi 2 – beskrivelse",
  "about.materials.kicker": "Overtitel",
  "about.materials.headline": "Overskrift",
  "about.materials.paragraph1": "Afsnit 1",
  "about.materials.paragraph2": "Afsnit 2",
  "about.materials.paragraph3": "Afsnit 3",
  "about.images.heroAlt": "Billedtekst: øverste billede",
  "about.images.heritageAlt": "Billedtekst: billedbåndet (rejser)",
  "about.images.standAlt": "Billedtekst: standen set ovenfra",
  "about.images.messeAlt": "Billedtekst: manden på messen",
  "about.images.materialsAlt": "Billedtekst: materialer",
  "about.metadata.title": "Sidetitel (fanebladet og Google)",
  "about.metadata.description": "Beskrivelse i Google",
  "about.metadata.shareTitle": "Titel ved deling (Facebook, Instagram m.fl.)",
  "about.metadata.shareDescription": "Beskrivelse ved deling",
  "about.metadata.shareImageAlt": "Billedtekst på delingsbilledet",
};
