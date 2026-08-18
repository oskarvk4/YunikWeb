"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";

interface Slide {
  src: string;
  srcMobile?: string;
  alt: string;
  position?: string;
}

interface HeroContent {
  kicker: string;
  headlineLine1: string;
  headlineLine2: string;
  body: string;
  cta: string;
}

const DEFAULT_CONTENT: HeroContent = {
  kicker: "Håndlavet med Kærlighed",
  headlineLine1: "Tidløs",
  headlineLine2: "Elegance",
  body: "Opdag smykker der fejrer din unikke historie. Hvert stykke er skabt til at blive en værdsat del af din rejse.",
  cta: "Se Kollektionen",
};

const SLIDES: Slide[] = [

  {
    src: "/yunik-18.webp",
    alt: "Yunik smykker – ny kollektion",
    position: "object-center",
  },
  {
    src: "/yunik-17.webp",
    alt: "Yunik smykker – håndlavet guld",
    position: "object-center",
  },
  {
    src: "/hero-bracelet.webp",
    alt: "Yunik armbånd i guld",
    position: "object-center",
  },

  {
    src: "/hero-rings.webp",
    srcMobile: "/yunik-14.jpg",
    alt: "Yunik ringe og armbånd i guld",
    position: "object-center",
  },
];

const AUTOPLAY_MS = 5500;
const SLIDE_MS = 550;

export default function HeroCarousel({ content = DEFAULT_CONTENT }: { content?: HeroContent }) {
  const [index, setIndex] = useState(0);

  const paginate = useCallback((dir: 1 | -1) => {
    setIndex((current) => (current + dir + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => paginate(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paginate]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") paginate(1);
      else if (e.key === "ArrowLeft") paginate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [paginate]);

  return (
    <section
      className="relative h-screen min-h-[600px] max-h-[900px] w-full overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Yunik – udvalgte billeder"
    >
      {/* Sliding track — GPU-compositing translate3d */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full"
          style={{
            width: `${SLIDES.length * 100}%`,
            transform: `translate3d(-${(index * 100) / SLIDES.length}%, 0, 0)`,
            transition: `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`,
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className="relative h-full flex-none"
              style={{ width: `${100 / SLIDES.length}%` }}
              aria-hidden={i !== index}
            >
              {slide.srcMobile ? (
                <>
                  <Image
                    src={slide.srcMobile}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    loading={i === 0 ? undefined : "eager"}
                    quality={80}
                    className={`object-cover md:hidden ${slide.position ?? "object-center"}`}
                    sizes="100vw"
                  />
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={i === 0}
                    loading={i === 0 ? undefined : "eager"}
                    quality={80}
                    className={`object-cover hidden md:block ${slide.position ?? "object-center"}`}
                    sizes="100vw"
                  />
                </>
              ) : (
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                  quality={80}
                  className={`object-cover ${slide.position ?? "object-center"}`}
                  sizes="100vw"
                />
              )}
            </div>
          ))}
        </div>
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1A1A]/70 via-[#1A1A1A]/35 to-[#1A1A1A]/20 md:bg-gradient-to-r md:from-[#1A1A1A]/50 md:via-[#1A1A1A]/20 md:to-transparent z-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 h-full flex items-center">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl translate-y-16">
            <p className="text-white/80 text-sm font-sans uppercase tracking-[0.3em] mb-4">
              {content.kicker}
            </p>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-light text-white leading-tight mb-6">
              {content.headlineLine1}
              <br />
              {content.headlineLine2}
            </h1>
            <p className="text-white/80 text-lg font-sans font-light leading-relaxed mb-8 max-w-md">
              {content.body}
            </p>
            <Link href="/shop">
              <Button variant="primary" size="lg">
                {content.cta}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Prev / next */}
      <button
        type="button"
        onClick={() => paginate(-1)}
        aria-label="Forrige billede"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => paginate(1)}
        aria-label="Næste billede"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Gå til billede ${i + 1}`}
            aria-current={i === index}
            className={`h-1.5 rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white ${
              i === index ? "w-8 bg-white" : "w-4 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
