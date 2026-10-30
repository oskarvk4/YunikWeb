"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { saveCopy, resetCopy } from "@/app/admin/copy/actions";

type Field = {
  key: string;
  label: string;
  defaultValue: string;
  multiline?: boolean;
};

type Section = {
  key: string;
  title: string;
  fields: Field[];
};

type Page = {
  key: string;
  title: string;
  previewHref?: string;
  sections: Section[];
};

interface Props {
  pages: Page[];
  overrides: Record<string, string>;
}

export default function CopyEditor({ pages, overrides }: Props) {
  const sections = useMemo(() => pages.flatMap((p) => p.sections), [pages]);
  const initial = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of sections) for (const f of s.fields) map[f.key] = overrides[f.key] ?? f.defaultValue;
    return map;
  }, [sections, overrides]);

  const [values, setValues] = useState<Record<string, string>>(initial);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  // With a search, only fields whose label, key or current text match are shown,
  // and their sections open by themselves.
  const matches = (f: Field) =>
    !q ||
    f.label.toLowerCase().includes(q) ||
    f.key.toLowerCase().includes(q) ||
    (values[f.key] ?? "").toLowerCase().includes(q);

  const defaults = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of sections) for (const f of s.fields) map[f.key] = f.defaultValue;
    return map;
  }, [sections]);

  const dirtyKeys = useMemo(
    () => Object.keys(values).filter((k) => values[k] !== initial[k]),
    [values, initial]
  );

  const onSave = () => {
    setStatus(null);
    startTransition(async () => {
      const entries = dirtyKeys.map((k) => ({ key: k, value: values[k] }));
      const res = await saveCopy(entries);
      if (res.ok) setStatus({ kind: "ok", msg: "Ændringer gemt og live." });
      else setStatus({ kind: "err", msg: res.error });
    });
  };

  const onResetField = (key: string) => {
    setValues((v) => ({ ...v, [key]: defaults[key] }));
  };

  const onResetAllOverrides = () => {
    if (!confirm("Nulstil alle tekster til standard? Dette kan ikke fortrydes.")) return;
    const overriddenKeys = Object.keys(overrides);
    setStatus(null);
    startTransition(async () => {
      const res = await resetCopy(overriddenKeys);
      if (res.ok) {
        setValues(defaults);
        setStatus({ kind: "ok", msg: "Alle tekster nulstillet." });
      } else {
        setStatus({ kind: "err", msg: res.error });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Sticky action bar */}
      <div className="sticky top-0 z-10 -mx-6 lg:-mx-8 px-6 lg:px-8 py-4 bg-gray-50/95 backdrop-blur border-b border-dark/10 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={isPending || dirtyKeys.length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded font-medium hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? "Gemmer…" : dirtyKeys.length > 0 ? `Gem ${dirtyKeys.length} ændring${dirtyKeys.length === 1 ? "" : "er"}` : "Ingen ændringer"}
        </button>
        <button
          type="button"
          onClick={onResetAllOverrides}
          disabled={isPending || Object.keys(overrides).length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-dark/20 text-dark rounded font-medium hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Nulstil alt
        </button>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søg i alle tekster…"
          aria-label="Søg i tekster"
          className="flex-1 min-w-[12rem] px-4 py-2.5 border border-dark/20 focus:border-accent focus:outline-none rounded font-sans text-dark bg-white"
        />
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-dark/20 text-dark rounded font-medium hover:bg-white transition-colors"
        >
          Åbn butik i ny fane ↗
        </Link>
      </div>

      {status && (
        <div
          className={`rounded p-4 ${
            status.kind === "ok"
              ? "bg-green-50 border border-green-200 text-green-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          {status.msg}
        </div>
      )}

      {q && !pages.some((p) => p.sections.some((s) => s.fields.some(matches))) && (
        <p className="text-dark/60">Ingen tekster matcher &quot;{query}&quot;.</p>
      )}

      {pages.map((page) => {
        const visibleSections = page.sections
          .map((section) => ({ section, fields: section.fields.filter(matches) }))
          .filter(({ fields }) => fields.length > 0);
        if (visibleSections.length === 0) return null;
        return (
          <div key={page.key} className="space-y-3">
            <div className="flex items-baseline justify-between gap-3 pt-4">
              <h2 className="font-serif text-2xl text-dark">{page.title}</h2>
              {page.previewHref && (
                <Link
                  href={page.previewHref}
                  target="_blank"
                  rel="noopener"
                  className="text-sm text-accent hover:underline"
                >
                  Åbn side ↗
                </Link>
              )}
            </div>
            {visibleSections.map(({ section, fields }) => (
              <details
                key={section.key}
                open={!!q}
                className="group bg-white border border-dark/10 rounded-lg overflow-hidden"
              >
                <summary className="px-6 py-4 flex items-center justify-between gap-3 cursor-pointer list-none">
                  <span className="font-serif text-lg text-dark">{section.title}</span>
                  <span className="text-sm text-dark/50">
                    {fields.length} {fields.length === 1 ? "tekst" : "tekster"}
                    <span className="ml-2 inline-block transition-transform group-open:rotate-180">▾</span>
                  </span>
                </summary>
                <div className="p-6 pt-2 space-y-6 border-t border-dark/10">
                {fields.map((f) => {
                const isDirty = values[f.key] !== initial[f.key];
                const isOverride = overrides[f.key] !== undefined;
                return (
                  <div key={f.key}>
                    <div className="flex items-center justify-between mb-2 gap-2">
                      <label className="block text-sm font-medium text-dark">
                        {f.label}
                        {isOverride && (
                          <span className="ml-2 text-xs font-normal text-accent">
                            (ændret fra standard)
                          </span>
                        )}
                        {isDirty && (
                          <span className="ml-2 text-xs font-normal text-orange-600">
                            • ikke gemt
                          </span>
                        )}
                      </label>
                      <button
                        type="button"
                        onClick={() => onResetField(f.key)}
                        className="text-xs text-dark/60 hover:text-dark"
                        title="Nulstil dette felt til standard"
                      >
                        Nulstil
                      </button>
                    </div>
                    {f.multiline ? (
                      <textarea
                        value={values[f.key]}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [f.key]: e.target.value }))
                        }
                        rows={Math.max(3, Math.ceil(values[f.key].length / 60))}
                        className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none rounded font-sans text-dark leading-relaxed"
                      />
                    ) : (
                      <input
                        type="text"
                        value={values[f.key]}
                        onChange={(e) =>
                          setValues((v) => ({ ...v, [f.key]: e.target.value }))
                        }
                        className="w-full px-4 py-3 border border-dark/20 focus:border-accent focus:outline-none rounded font-sans text-dark"
                      />
                    )}
                    <p className="mt-2 text-xs text-dark/50">
                      Nøgle: <code className="font-mono">{f.key}</code>
                    </p>
                  </div>
                );
              })}
                </div>
              </details>
            ))}
          </div>
        );
      })}
    </div>
  );
}
