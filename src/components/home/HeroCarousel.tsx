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
  body: string;
  cta: string;
  secondaryCta: string;
}

const DEFAULT_CONTENT: HeroContent = {
  kicker: "Formet gennem mere end 30 år",
  body: "Opdag smykker der fejrer din unikke historie. Hvert stykke er skabt til at blive en værdsat del af din rejse.",
  cta: "Se Kollektionen",
  secondaryCta: "Shop øreringe",
};

const SLIDES: Slide[] = [

  {
    src: "/yunik-18.webp",
    alt: "Yunik smykker – ny kollektion",
    // Her face is at the photo's left edge; on narrow phones a centred crop cuts it off.
    position: "object-[15%_50%] md:object-center",
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
  const [hovered, setHovered] = useState(false);
  // Once someone steps through the slides themselves, rotation stops for this visit.
  const [steppedThrough, setSteppedThrough] = useState(false);

  const advance = useCallback((dir: 1 | -1) => {
    setIndex((current) => (current + dir + SLIDES.length) % SLIDES.length);
  }, []);

  const paginate = useCallback((dir: 1 | -1) => {
    setSteppedThrough(true);
    advance(dir);
  }, [advance]);

  useEffect(() => {
    if (hovered || steppedThrough) return;
    const id = window.setInterval(() => advance(1), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [advance, hovered, steppedThrough]);

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
      // Phones: mt-20 starts the photo below the fixed 80px header instead of under it,
      // so the header never hides the top of the picture (faces sit high in these shots).
      className="relative mt-20 md:mt-0 h-[70vh] min-h-[520px] max-h-[760px] w-full overflow-hidden md:h-[75vh] md:min-h-[560px] md:max-h-[820px]"
      aria-roledescription="carousel"
      aria-label="Yunik – udvalgte billeder"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
        {/* Phones: shade only the bottom, where the text sits, so the jewelry stays clear. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/65 via-[#1A1A1A]/15 to-transparent md:bg-gradient-to-r md:from-[#1A1A1A]/50 md:via-[#1A1A1A]/20 md:to-transparent z-10" />
      </div>

      {/* Mobile tap zones */}
      <button
        type="button"
        onClick={() => paginate(-1)}
        aria-label="Forrige billede"
        className="absolute left-0 top-0 z-[15] h-full w-1/3 touch-manipulation bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white md:hidden"
      />
      <button
        type="button"
        onClick={() => paginate(1)}
        aria-label="Næste billede"
        className="absolute right-0 top-0 z-[15] h-full w-2/3 touch-manipulation bg-transparent outline-none focus-visible:ring-2 focus-visible:ring-white md:hidden"
      />

      {/* Content */}
      {/* Phones: text anchored to the bottom of the photo, above the dots, off the subject. */}
      <div className="relative z-20 h-full flex items-end pb-16 md:items-center md:pb-0">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl md:translate-y-16">
            <h1 className="text-white/90 text-sm font-sans uppercase tracking-[0.2em] md:tracking-[0.3em] mb-6 md:mb-8">
              {content.kicker}
            </h1>
            {content.body && (
              <p className="text-white/80 text-lg font-sans font-light leading-relaxed mb-8 max-w-md">
                {content.body}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              <Link href="/shop">
                <Button variant="primary" size="lg" className="text-white!">
                  {content.cta}
                </Button>
              </Link>
              <Link
                href="/shop?category=earrings"
                className="text-sm font-sans uppercase tracking-[0.15em] text-white underline underline-offset-8 decoration-white/40 hover:decoration-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
              >
                {content.secondaryCta}
              </Link>
            </div>
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
      <div className="absolute bottom-5 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            onClick={() => {
              setSteppedThrough(true);
              setIndex(i);
            }}
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
