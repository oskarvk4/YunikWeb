import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Yunik | Kommer Snart",
  description:
    "Yunik åbner snart. Håndlavede smykker med tidløs elegance.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComingSoonPage() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#1A1A1A]">
      <div className="absolute inset-0">
        <Image
          src="/yunik-17.webp"
          alt="Yunik håndlavede smykker"
          fill
          priority
          quality={90}
          className="object-cover object-[50%_60%]"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/85 via-[#1A1A1A]/55 to-[#1A1A1A]/85" />
      </div>

      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16">
        <p className="text-white/70 text-xs sm:text-sm font-sans uppercase tracking-[0.4em] mb-8">
          Håndlavet med Kærlighed
        </p>

        <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl font-light text-white leading-none mb-6">
          Yunik
        </h1>

        <div className="w-16 h-px bg-white/40 mb-8" />

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white/90 mb-6">
          Kommer Snart
        </h2>

        <p className="text-white/75 text-base sm:text-lg font-sans font-light leading-relaxed max-w-md mb-10">
          Vi pudser de sidste smykker. Tidløs elegance, håndlavet med
          omhu — klar til dig meget snart.
        </p>

        <a
          href="mailto:kontakt@yunik.dk"
          className="text-white/80 text-sm font-sans uppercase tracking-[0.25em] border-b border-white/40 hover:border-white hover:text-white transition-colors pb-1"
        >
          kontakt@yunik.dk
        </a>
      </div>
    </section>
  );
}
