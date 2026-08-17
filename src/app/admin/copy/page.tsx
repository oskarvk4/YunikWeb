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
