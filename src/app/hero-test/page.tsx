import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import Link from "next/link";
import Hero from "@/components/home/Hero";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function HeroTestPage() {
  const dir = path.join(process.cwd(), "public/hero-options");
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort();
  } catch {
    files = [];
  }

  if (files.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center bg-[#F5F0EB]">
        <div>
          <p className="font-serif text-2xl mb-2">Ingen kandidatbilleder fundet</p>
          <p className="text-sm text-[#666] mb-4">
            Læg billeder i <code className="font-mono">public/hero-options/</code>
          </p>
          <Link href="/" className="underline">← Tilbage</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {files.map((file) => (
        <div key={file} className="relative">
          <Hero mobileImageSrc={`/hero-options/${file}`} />
          <div className="absolute top-20 left-4 z-20 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-mono text-[#1A1A1A] max-w-[90vw] truncate">
            {file}
          </div>
        </div>
      ))}
      <div className="fixed bottom-4 right-4 z-30 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-sans uppercase tracking-[0.15em] shadow">
        <Link href="/">← Forside</Link>
      </div>
    </>
  );
}
