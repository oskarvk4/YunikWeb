"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { getImageProps } from "next/image";
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
    src: "/hero-carousel-collection.webp",
    alt: "Yunik smykker – ny kollektion",
    // Her face is at the photo's left edge; on narrow phones a centred crop cuts it off.
    position: "object-[15%_50%] md:object-center",
  },
  {
    src: "/jewelry-close-up.webp",
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
    srcMobile: "/luna-pendant.jpg",
    alt: "Yunik ringe og armbånd i guld",
    position: "object-center",
  },
];

const COUNT = SLIDES.length;

// The track is [last, ...slides, first]. Moving past either end lands on a copy of
// the neighbouring photo and then jumps to the real one without animating, so the
// carousel loops forward and back instead of rewinding across every photo.
const TRACK: Slide[] = [SLIDES[COUNT - 1], ...SLIDES, SLIDES[0]];
const SLOT_PCT = 100 / TRACK.length;

const AUTOPLAY_MS = 5500;
const SLIDE_MS = 550;

// The first photo is the page's largest paint, so it alone is preloaded at high
// priority. The others are only rendered once the page has loaded (see `restReady`):
// React preloads every non-lazy <img> it streams, so rendering them up front made
// all four photos compete with the first one for bandwidth.
function SlideImage({ slide, first }: { slide: Slide; first: boolean }) {
  const className = `object-cover ${slide.position ?? "object-center"}`;
  const fetchPriority = first ? ("high" as const) : ("low" as const);

  if (!slide.srcMobile) {
    return (
      <Image
        src={slide.src}
        alt={slide.alt}
        fill
        draggable={false}
        quality={80}
        sizes="100vw"
        className={className}
        fetchPriority={fetchPriority}
        {...(first ? { preload: true } : { loading: "eager" as const })}
      />
    );
  }

  // A different photo on phones: one <picture>, so only the matching file downloads.
  // No preload here: a preload can't follow the <source> media switch.
  const shared = {
    alt: slide.alt,
    fill: true,
    quality: 80,
    sizes: "100vw",
    className,
    loading: "eager" as const,
    fetchPriority,
  };
  const desktop = getImageProps({ ...shared, src: slide.src }).props;
  const mobile = getImageProps({ ...shared, src: slide.srcMobile }).props;
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobile.srcSet} sizes="100vw" />
      <img {...desktop} alt={slide.alt} draggable={false} />
    </picture>
  );
}

export default function HeroCarousel({ content = DEFAULT_CONTENT }: { content?: HeroContent }) {
  const sectionRef = useRef<HTMLElement>(null);
  // Position in TRACK (1 = first real photo) and whether moves are animated.
  const [pos, setPos] = useState(1);
  const [animate, setAnimate] = useState(true);
  const [dragX, setDragX] = useState<number | null>(null);
  const [hovered, setHovered] = useState(false);
  // Once someone steps through the slides themselves, rotation stops for this visit.
  const [steppedThrough, setSteppedThrough] = useState(false);
  // Whether the photos after the first are rendered yet: once the page has loaded,
  // or after a short wait if loading drags on, so a quick swipe still finds them.
  const [restReady, setRestReady] = useState(false);

  useEffect(() => {
    const ready = () => setRestReady(true);
    if (document.readyState === "complete") {
      const soon = window.setTimeout(ready, 0);
      return () => window.clearTimeout(soon);
    }
    window.addEventListener("load", ready, { once: true });
    const fallback = window.setTimeout(ready, 3000);
    return () => {
      window.removeEventListener("load", ready);
      window.clearTimeout(fallback);
    };
  }, []);

  const posRef = useRef(1);
  // Moves are ignored until this time, so a second tap or swipe can't start while a
  // slide is still travelling. A timestamp (not a flag) can never get stuck.
  const busyUntil = useRef(0);
  const settleTimer = useRef<number | undefined>(undefined);

  const index = (pos - 1 + COUNT) % COUNT;

  const moveTo = useCallback((next: number) => {
    posRef.current = next;
    setPos(next);
  }, []);

  // Called when a slide transition ends. Landing on a copy at either end jumps to
  // the matching real photo with no animation; the copy looks identical. Safe to
  // call twice: once the position is on a real photo it does nothing.
  const settle = useCallback(() => {
    window.clearTimeout(settleTimer.current);
    const p = posRef.current;
    const jumpTo = p === COUNT + 1 ? 1 : p === 0 ? COUNT : null;
    if (jumpTo === null) return;
    // Give the jump a moment to paint before another move can start.
    busyUntil.current = Date.now() + 80;
    setAnimate(false);
    moveTo(jumpTo);
  }, [moveTo]);

  const slideTo = useCallback(
    (target: number) => {
      if (Date.now() < busyUntil.current || target === posRef.current) return;
      busyUntil.current = Date.now() + SLIDE_MS + 100;
      setAnimate(true);
      moveTo(target);
      // Safety net if the browser never reports transitionend (hidden tab, no motion).
      window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(settle, SLIDE_MS + 60);
    },
    [moveTo, settle]
  );

  const step = useCallback((dir: 1 | -1) => slideTo(posRef.current + dir), [slideTo]);

  useEffect(() => () => window.clearTimeout(settleTimer.current), []);

  useEffect(() => {
    if (hovered || steppedThrough) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") step(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [hovered, steppedThrough, step]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      // Arrow keys belong to form fields while someone is typing in one.
      const el = e.target as HTMLElement | null;
      if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
      // ...and only steer the hero while it is on screen.
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect || rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      setSteppedThrough(true);
      step(e.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  // Swipe: the photos follow a horizontal drag, one photo at most; a mostly vertical
  // drag is left to the browser (touch-action: pan-y) so the page still scrolls.
  const touch = useRef<{ x: number; y: number; t: number; axis: "x" | "y" | null } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    if (Date.now() < busyUntil.current) {
      touch.current = null;
      return;
    }
    const p = e.touches[0];
    touch.current = { x: p.clientX, y: p.clientY, t: Date.now(), axis: null };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const start = touch.current;
    if (!start) return;
    const p = e.touches[0];
    const dx = p.clientX - start.x;
    const dy = p.clientY - start.y;
    if (!start.axis) {
      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
      start.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
      if (start.axis === "x") setSteppedThrough(true);
    }
    if (start.axis !== "x") return;
    const width = sectionRef.current?.clientWidth ?? window.innerWidth;
    setDragX(Math.max(-width, Math.min(width, dx)));
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touch.current;
    touch.current = null;
    if (!start || start.axis !== "x") {
      setDragX(null);
      return;
    }
    const dx = (e.changedTouches[0]?.clientX ?? start.x) - start.x;
    const flick = Math.abs(dx) > 20 && Math.abs(dx) / Math.max(1, Date.now() - start.t) > 0.4;
    setDragX(null);
    if (Math.abs(dx) > 50 || flick) step(dx < 0 ? 1 : -1);
  };

  return (
    <section
      ref={sectionRef}
      // Phones: mt-20 starts the photo below the fixed 80px header instead of under it,
      // so the header never hides the top of the picture (faces sit high in these shots).
      // Height leaves room for the trust bar below on the first screen: phones subtract
      // the 5rem header and up to 10rem of bar, desktop the 7rem bar.
      className="relative mt-20 md:mt-0 h-[calc(100svh-8.5rem-1px)] min-h-[360px] max-h-[760px] w-full overflow-hidden touch-pan-y md:h-[calc(100svh-2.75rem-1px)] md:min-h-[520px] md:max-h-[820px]"
      aria-roledescription="carousel"
      aria-label="Yunik – udvalgte billeder"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {/* Sliding track — GPU-compositing translate3d */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full"
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget && e.propertyName === "transform") settle();
          }}
          style={{
            width: `${TRACK.length * 100}%`,
            transform: `translate3d(calc(-${pos * SLOT_PCT}% + ${dragX ?? 0}px), 0, 0)`,
            // No easing while a finger is down (the photo tracks it exactly) or while
            // jumping from a copy back to the real photo.
            transition:
              animate && dragX === null
                ? `transform ${SLIDE_MS}ms cubic-bezier(0.65, 0, 0.35, 1)`
                : "none",
            willChange: "transform",
            backfaceVisibility: "hidden",
          }}
        >
          {TRACK.map((slide, i) => {
            const isCopy = i === 0 || i === TRACK.length - 1;
            const realIndex = (i - 1 + COUNT) % COUNT;
            return (
              <div
                key={`${slide.src}-${i}`}
                className="relative h-full flex-none bg-[#E9E2DA]"
                style={{ width: `${SLOT_PCT}%` }}
                aria-hidden={isCopy || realIndex !== index}
              >
                {(i === 1 || restReady) && <SlideImage slide={slide} first={i === 1} />}
              </div>
            );
          })}
        </div>
        {/* Overlay: phones shade the bottom, where the text sits; larger screens shade the left. */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/65 via-[#1A1A1A]/15 to-transparent md:bg-gradient-to-r md:from-[#1A1A1A]/50 md:via-[#1A1A1A]/20 md:to-transparent z-10" />
      </div>

      {/* Content: bottom of the photo on phones. Larger screens: centred, then pushed down
          12.5% of the hero (top % resolves against the full-height flex row). */}
      <div className="relative z-20 h-full flex items-end pb-16 md:items-center md:pb-0">
        <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 md:relative md:top-[12.5%]">
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
        onClick={() => {
          setSteppedThrough(true);
          step(-1);
        }}
        aria-label="Forrige billede"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm text-white transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => {
          setSteppedThrough(true);
          step(1);
        }}
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
              slideTo(i + 1);
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
