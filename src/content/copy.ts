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
} as const;

export type Copy = {
  [K in keyof typeof defaultCopy]: {
    [S in keyof (typeof defaultCopy)[K]]: {
      [F in keyof (typeof defaultCopy)[K][S]]: string;
    };
  };
};
