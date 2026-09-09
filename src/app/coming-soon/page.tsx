import type { Metadata } from "next";
import Image from "next/image";
import EarlyAccessForm from "@/components/coming-soon/EarlyAccessForm";

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

      {/* The stagger below is a single pass on load — each block fades up a
          beat after the one above it, ending on the sign-up. */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-16">
        <div
          className="w-16 h-px bg-white/40 mb-8 animate-fade-in"
          style={{ animationDelay: "0.05s" }}
        />

        <h1
          className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-light text-white leading-none mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          Kommer Snart
        </h1>

        <p
          className="text-white/60 text-sm sm:text-base font-sans font-light leading-relaxed max-w-md mb-14 animate-fade-in-up"
          style={{ animationDelay: "0.45s" }}
        >
          Vi pudser de sidste smykker. Tidløs elegance, håndlavet med
          omhu — klar til dig meget snart.
        </p>

        <div
          className="w-full flex justify-center animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <EarlyAccessForm />
        </div>

        <a
          href="mailto:kontakt@yunik.dk"
          className="mt-16 text-white/40 text-xs font-sans uppercase tracking-[0.25em] border-b border-white/20 hover:border-white/60 hover:text-white/80 transition-colors pb-1 animate-fade-in"
          style={{ animationDelay: "0.8s" }}
        >
          kontakt@yunik.dk
        </a>
      </div>
    </section>
  );
}
