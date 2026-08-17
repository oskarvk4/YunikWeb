import { createClient } from "@/lib/supabase/server";
import { defaultCopy } from "@/content/copy";
import CopyEditor from "@/components/admin/CopyEditor";

export const metadata = { title: "Tekster" };
export const dynamic = "force-dynamic";

// Human labels and previews for each section. Add new sections here as you
// migrate more pages to use getCopy() in src/lib/copy.ts.
const SECTIONS = [
  {
    key: "home.hero" as const,
    title: "Forside – Hero",
    previewHref: "/",
    fields: [
      { key: "kicker", label: "Overtitel", multiline: false },
      { key: "headlineLine1", label: "Overskrift – linje 1", multiline: false },
      { key: "headlineLine2", label: "Overskrift – linje 2", multiline: false },
      { key: "body", label: "Brødtekst", multiline: true },
      { key: "cta", label: "Knap tekst", multiline: false },
    ],
  },
  {
    key: "about.hero" as const,
    title: "Om os – Hero",
    previewHref: "/about",
    fields: [
      { key: "headline", label: "Overskrift", multiline: false },
      { key: "subhead", label: "Undertitel", multiline: false },
    ],
  },
  {
    key: "about.story" as const,
    title: "Om os – Vores historie",
    previewHref: "/about",
    fields: [
      { key: "kicker", label: "Overtitel", multiline: false },
      { key: "headline", label: "Overskrift", multiline: false },
      { key: "paragraph1", label: "Afsnit 1", multiline: true },
      { key: "paragraph2", label: "Afsnit 2", multiline: true },
    ],
  },
  {
    key: "about.heritage" as const,
    title: "Om os – Familiearkiv (billedbånd)",
    previewHref: "/about",
    fields: [
      { key: "kicker", label: "Overtitel", multiline: false },
      { key: "body", label: "Citat", multiline: true },
    ],
  },
  {
    key: "about.values" as const,
    title: "Om os – Vores værdier",
    previewHref: "/about",
    fields: [
      { key: "headline", label: "Overskrift", multiline: false },
      { key: "title1", label: "Værdi 1 – titel", multiline: false },
      { key: "body1", label: "Værdi 1 – beskrivelse", multiline: true },
      { key: "title2", label: "Værdi 2 – titel", multiline: false },
      { key: "body2", label: "Værdi 2 – beskrivelse", multiline: true },
      { key: "title3", label: "Værdi 3 – titel", multiline: false },
      { key: "body3", label: "Værdi 3 – beskrivelse", multiline: true },
    ],
  },
  {
    key: "about.materials" as const,
    title: "Om os – Materialer",
    previewHref: "/about#materials",
    fields: [
      { key: "kicker", label: "Overtitel", multiline: false },
      { key: "headline", label: "Overskrift", multiline: false },
      { key: "paragraph1", label: "Afsnit 1", multiline: true },
      { key: "paragraph2", label: "Afsnit 2", multiline: true },
      { key: "paragraph3", label: "Afsnit 3", multiline: true },
    ],
  },
  {
    key: "about.sustainability" as const,
    title: "Om os – Bæredygtighed",
    previewHref: "/about#sustainability",
    fields: [
      { key: "kicker", label: "Overtitel", multiline: false },
      { key: "headline", label: "Overskrift", multiline: false },
      { key: "paragraph1", label: "Afsnit 1", multiline: true },
      { key: "paragraph2", label: "Afsnit 2", multiline: true },
      { key: "paragraph3", label: "Afsnit 3", multiline: true },
    ],
  },
  {
    key: "contact.header" as const,
    title: "Kontakt – Header",
    previewHref: "/contact",
    fields: [
      { key: "headline", label: "Overskrift", multiline: false },
      { key: "subhead", label: "Undertitel", multiline: false },
    ],
  },
  {
    key: "contact.info" as const,
    title: "Kontakt – Kontaktinformation",
    previewHref: "/contact",
    fields: [
      { key: "headline", label: "Overskrift", multiline: false },
      { key: "body", label: "Brødtekst", multiline: true },
      { key: "emailLabel", label: "Email – label", multiline: false },
      { key: "email", label: "Email – adresse (bruges også i mailto-link)", multiline: false },
      { key: "responseLabel", label: "Svartid – label", multiline: false },
      { key: "responseBody", label: "Svartid – tekst", multiline: false },
      { key: "addressLabel", label: "Adresse – label", multiline: false },
      { key: "addressLine1", label: "Adresse – linje 1", multiline: false },
      { key: "addressLine2", label: "Adresse – linje 2", multiline: false },
    ],
  },
  {
    key: "contact.faqBox" as const,
    title: "Kontakt – FAQ boks",
    previewHref: "/contact",
    fields: [
      { key: "title", label: "Titel", multiline: false },
      { key: "body", label: "Beskrivelse", multiline: false },
      { key: "cta", label: "Link tekst", multiline: false },
    ],
  },
  {
    key: "contact.form" as const,
    title: "Kontakt – Formular",
    previewHref: "/contact",
    fields: [
      { key: "kicker", label: "Overtitel", multiline: false },
      { key: "headline", label: "Overskrift", multiline: false },
      { key: "body", label: "Beskrivelse", multiline: true },
      { key: "nameLabel", label: "Navn – label", multiline: false },
      { key: "namePlaceholder", label: "Navn – placeholder", multiline: false },
      { key: "emailLabel", label: "Email – label", multiline: false },
      { key: "emailPlaceholder", label: "Email – placeholder", multiline: false },
      { key: "subjectLabel", label: "Emne – label", multiline: false },
      { key: "subjectPlaceholder", label: "Emne – placeholder", multiline: false },
      { key: "subjectOrder", label: "Emne – valg: Ordre", multiline: false },
      { key: "subjectProduct", label: "Emne – valg: Produkt", multiline: false },
      { key: "subjectReturn", label: "Emne – valg: Retur/bytte", multiline: false },
      { key: "subjectOther", label: "Emne – valg: Andet", multiline: false },
      { key: "messageLabel", label: "Besked – label", multiline: false },
      { key: "messagePlaceholder", label: "Besked – placeholder", multiline: true },
      { key: "privacyNote", label: "Privatlivsnote", multiline: true },
      { key: "submit", label: "Send-knap", multiline: false },
      { key: "submitting", label: "Send-knap (mens der sendes)", multiline: false },
      { key: "successMessage", label: "Succes-besked", multiline: true },
      { key: "defaultError", label: "Standard fejlbesked", multiline: true },
    ],
  },
];

export default async function CopyAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_copy").select("key, value");
  const overrides: Record<string, string> = {};
  for (const row of (data ?? []) as { key: string; value: string }[]) {
    overrides[row.key] = row.value;
  }

  // Build the editor sections from the defaults tree so keys are guaranteed valid.
  const sections = SECTIONS.map((s) => {
    const [top, sub] = s.key.split(".") as [
      keyof typeof defaultCopy,
      string
    ];
    const group = (defaultCopy as Record<string, Record<string, Record<string, string>>>)[top][sub];
    return {
      title: s.title,
      previewHref: s.previewHref,
      fields: s.fields.map((f) => ({
        key: `${s.key}.${f.key}`,
        label: f.label,
        multiline: !!f.multiline,
        defaultValue: group[f.key] ?? "",
      })),
    };
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-dark">Tekster</h1>
        <p className="text-dark/60 mt-1">
          Rediger tekster på butikken. Ændringer bliver live med det samme.
        </p>
      </div>

      <CopyEditor sections={sections} overrides={overrides} />
    </div>
  );
}
