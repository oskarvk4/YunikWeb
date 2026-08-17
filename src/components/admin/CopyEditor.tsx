"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { saveCopy, resetCopy } from "@/app/admin/copy/actions";

type Section = {
  title: string;
  previewHref?: string;
  fields: {
    key: string;
    label: string;
    defaultValue: string;
    multiline?: boolean;
  }[];
};

interface Props {
  sections: Section[];
  overrides: Record<string, string>;
}

export default function CopyEditor({ sections, overrides }: Props) {
  const initial = useMemo(() => {
    const map: Record<string, string> = {};
    for (const s of sections) for (const f of s.fields) map[f.key] = overrides[f.key] ?? f.defaultValue;
    return map;
  }, [sections, overrides]);

  const [values, setValues] = useState<Record<string, string>>(initial);
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<{ kind: "ok" | "err"; msg: string } | null>(null);

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
        <Link
          href="/"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-2 px-4 py-2.5 border border-dark/20 text-dark rounded font-medium hover:bg-white transition-colors ml-auto"
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

      {sections.map((section) => (
        <section
          key={section.title}
          className="bg-white border border-dark/10 rounded-lg overflow-hidden"
        >
          <header className="px-6 py-4 border-b border-dark/10 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-dark">{section.title}</h2>
            {section.previewHref && (
              <Link
                href={section.previewHref}
                target="_blank"
                rel="noopener"
                className="text-sm text-accent hover:underline"
              >
                Åbn side ↗
              </Link>
            )}
          </header>
          <div className="p-6 space-y-6">
            {section.fields.map((f) => {
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
        </section>
      ))}
    </div>
  );
}
