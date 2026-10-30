// Kontakt (/contact).

export const contactCopy = {
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
    metadata: {
      title: "Kontakt Os",
      description:
        "Kontakt Yunik — vi svarer inden for 24 timer på hverdage. Skriv til os om din ordre, et produkt eller noget helt tredje.",
    },
  },
} as const;

/** Section titles in /admin/copy, keyed "page.section". */
export const contactTitles: Record<string, string> = {
  "contact.header": "Kontakt – Header",
  "contact.info": "Kontakt – Kontaktinformation",
  "contact.faqBox": "Kontakt – FAQ boks",
  "contact.form": "Kontakt – Formular",
  "contact.metadata": "Kontakt – Titel og beskrivelse (fane og Google)",
};

/** Field labels in /admin/copy, keyed "page.section.field". Unlisted fields get a label from their key. */
export const contactLabels: Record<string, string> = {
  "contact.header.headline": "Overskrift",
  "contact.header.subhead": "Undertitel",
  "contact.info.headline": "Overskrift",
  "contact.info.body": "Brødtekst",
  "contact.info.emailLabel": "Email – label",
  "contact.info.email": "Email – adresse (bruges også i mailto-link)",
  "contact.info.responseLabel": "Svartid – label",
  "contact.info.responseBody": "Svartid – tekst",
  "contact.info.addressLabel": "Adresse – label",
  "contact.info.addressLine1": "Adresse – linje 1",
  "contact.info.addressLine2": "Adresse – linje 2",
  "contact.faqBox.title": "Titel",
  "contact.faqBox.body": "Beskrivelse",
  "contact.faqBox.cta": "Link tekst",
  "contact.form.kicker": "Overtitel",
  "contact.form.headline": "Overskrift",
  "contact.form.body": "Beskrivelse",
  "contact.form.nameLabel": "Navn – label",
  "contact.form.namePlaceholder": "Navn – placeholder",
  "contact.form.emailLabel": "Email – label",
  "contact.form.emailPlaceholder": "Email – placeholder",
  "contact.form.subjectLabel": "Emne – label",
  "contact.form.subjectPlaceholder": "Emne – placeholder",
  "contact.form.subjectOrder": "Emne – valg: Ordre",
  "contact.form.subjectProduct": "Emne – valg: Produkt",
  "contact.form.subjectReturn": "Emne – valg: Retur/bytte",
  "contact.form.subjectOther": "Emne – valg: Andet",
  "contact.form.messageLabel": "Besked – label",
  "contact.form.messagePlaceholder": "Besked – placeholder",
  "contact.form.privacyNote": "Privatlivsnote",
  "contact.form.submit": "Send-knap",
  "contact.form.submitting": "Send-knap (mens der sendes)",
  "contact.form.successMessage": "Succes-besked",
  "contact.form.defaultError": "Standard fejlbesked",
  "contact.metadata.title": "Sidetitel (fanebladet og Google)",
  "contact.metadata.description": "Beskrivelse i Google",
};
