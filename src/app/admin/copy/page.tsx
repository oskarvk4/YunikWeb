import { createClient } from "@/lib/supabase/server";
import {
  defaultCopy,
  COPY_PAGES,
  COPY_SECTION_TITLES,
  COPY_FIELD_LABELS,
} from "@/content/copy";
import CopyEditor from "@/components/admin/CopyEditor";

export const metadata = { title: "Tekster" };
export const dynamic = "force-dynamic";

// Danish names for common key parts, used to label fields that have no
// hand-written label in their copy module.
const WORDS: Record<string, string> = {
  headline: "Overskrift",
  subhead: "Undertitel",
  kicker: "Overtitel",
  title: "Titel",
  body: "Brødtekst",
  text: "Tekst",
  intro: "Intro",
  paragraph: "Afsnit",
  button: "Knap",
  cta: "Knap",
  link: "Link",
  label: "Label",
  placeholder: "Pladsholder",
  error: "Fejlbesked",
  success: "Besked ved succes",
  note: "Note",
  question: "Spørgsmål",
  answer: "Svar",
  q: "Spørgsmål",
  a: "Svar",
  item: "Punkt",
  point: "Punkt",
  short: "(kort)",
  message: "Besked",
  heading: "Overskrift",
  description: "Beskrivelse",
  empty: "Tom",
  loading: "Indlæser",
  aria: "Skærmlæser",
  seo: "Søgemaskiner",
};

/** "paragraph2" → "Afsnit 2", "emailLabel" → "Email label", "q3" → "Spørgsmål 3". */
function labelFromKey(key: string): string {
  const parts = key
    .replace(/([a-zæøå])([A-Z0-9])/g, "$1 $2")
    .replace(/([0-9])([a-zA-Z])/g, "$1 $2")
    .split(" ")
    .map((part) => WORDS[part.toLowerCase()] ?? part.toLowerCase());
  const text = parts.join(" ");
  return text.charAt(0).toUpperCase() + text.slice(1);
}

type Tree = Record<string, Record<string, Record<string, string>>>;

export default async function CopyAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_copy").select("key, value");
  const overrides: Record<string, string> = {};
  for (const row of (data ?? []) as { key: string; value: string }[]) {
    overrides[row.key] = row.value;
  }

  // Every page in the defaults tree, in COPY_PAGES order (any page missing from
  // that list goes last), each with all of its sections and fields.
  const tree = defaultCopy as unknown as Tree;
  const pageOrder = [
    ...COPY_PAGES.map((p) => p.key).filter((key) => key in tree),
    ...Object.keys(tree).filter((key) => !COPY_PAGES.some((p) => p.key === key)),
  ];

  const pages = pageOrder.map((pageKey) => {
    const page = COPY_PAGES.find((p) => p.key === pageKey);
    return {
      key: pageKey,
      title: page?.title ?? pageKey,
      previewHref: page?.href,
      sections: Object.entries(tree[pageKey]).map(([sectionKey, fields]) => {
        const path = `${pageKey}.${sectionKey}`;
        return {
          key: path,
          title: COPY_SECTION_TITLES[path] ?? labelFromKey(sectionKey),
          fields: Object.entries(fields).map(([fieldKey, defaultValue]) => {
            const key = `${path}.${fieldKey}`;
            return {
              key,
              label: COPY_FIELD_LABELS[key] ?? labelFromKey(fieldKey),
              multiline: defaultValue.length > 70 || defaultValue.includes("\n"),
              defaultValue,
            };
          }),
        };
      }),
    };
  });

  const fieldCount = pages.reduce(
    (n, page) => n + page.sections.reduce((m, s) => m + s.fields.length, 0),
    0
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-serif text-dark">Tekster</h1>
        <p className="text-dark/60 mt-1">
          Alle {fieldCount} tekster på butikken. Ændringer bliver live med det samme. Et
          linjeskift i en tekst bliver et linjeskift på siden; i lange tekster starter en tom
          linje et nyt afsnit, og linjer der starter med &quot;- &quot; bliver en punktliste.
          Ord i krøllede parenteser, fx {"{amount}"}, udfyldes automatisk og skal stå i teksten.
        </p>
      </div>

      <CopyEditor pages={pages} overrides={overrides} />
    </div>
  );
}
