'use client';

import Image from 'next/image';
import Link from 'next/link';

/**
 * Diagonal three-panel price filter.
 *
 * Geometry rules (this is what makes it clean):
 *  - All three panels are absolutely positioned full-bleed layers (inset: 0),
 *    so every clip-path percentage resolves against the SAME box.
 *  - Adjacent panels reuse the exact same vertex values, so the seams tile
 *    perfectly. No skew, no counter-skew, no overscan math.
 *  - Each panel underlaps its left neighbour by 1px and sits one z-index
 *    lower, so antialiasing on the diagonal can never show a white sliver.
 *  - Labels are placed at the CENTROID of each wedge, not the centre of the
 *    rectangle. That's why "1.000+ kr" stops crashing into the right edge.
 */

const TIERS = [
  {
    href: '/shop?pris=500-700',
    label: '500–700 kr',
    src: '/images/tier-earrings.jpg',
    alt: 'Model med guldøreringe og ring',
    objectPosition: '60% 40%',
  },
  {
    href: '/shop?pris=700-1000',
    label: '700–1.000 kr',
    src: '/images/tier-bracelet.jpg',
    alt: 'Guldarmbånd med rå ametyst',
    objectPosition: '50% 50%',
  },
  {
    href: '/shop?pris=1000',
    label: '1.000+ kr',
    src: '/images/tier-ring.jpg',
    alt: 'Guldring med akvamarin cabochon',
    objectPosition: '45% 50%',
  },
];

export default function PriceSplit() {
  return (
    <section className="split" aria-label="Shop efter prisniveau">
      {TIERS.map((tier, i) => (
        <Link key={tier.href} href={tier.href} className={`panel panel-${i + 1}`}>
          <span className="frame">
            <Image
              src={tier.src}
              alt={tier.alt}
              fill
              sizes="40vw"
              style={{ objectFit: 'cover', objectPosition: tier.objectPosition }}
              priority={i === 0}
            />
            <span className="scrim" />
          </span>
          <span className="label">{tier.label}</span>
        </Link>
      ))}

      <style jsx>{`
        .split {
          /* Single source of truth for the diagonals.
             t = x-position at the top edge, b = x-position at the bottom edge.
             Changing these four numbers is the ONLY way to reshape the section. */
          --t1: 36%;
          --b1: 28%;
          --t2: 70%;
          --b2: 62%;
          --bleed: 1px;

          position: relative;
          width: 100%;
          height: clamp(420px, 68vh, 760px);
          overflow: hidden;
          background: #0d0d0d; /* never visible, but kills any flash on load */
          isolation: isolate;
        }

        .panel {
          position: absolute;
          inset: 0;
          display: block;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }

        /* Later panels sit LOWER so the neighbour above hides their overshoot. */
        .panel-1 {
          z-index: 3;
          clip-path: polygon(0 0, var(--t1) 0, var(--b1) 100%, 0 100%);
        }
        .panel-2 {
          z-index: 2;
          clip-path: polygon(
            calc(var(--t1) - var(--bleed)) 0,
            var(--t2) 0,
            var(--b2) 100%,
            calc(var(--b1) - var(--bleed)) 100%
          );
        }
        .panel-3 {
          z-index: 1;
          clip-path: polygon(
            calc(var(--t2) - var(--bleed)) 0,
            100% 0,
            100% 100%,
            calc(var(--b2) - var(--bleed)) 100%
          );
        }

        /* The image box is sized to the wedge's bounding box, not the whole
           section — otherwise you're only ever seeing a narrow vertical slice
           of a full-width crop, which is what makes these sections look random. */
        .frame {
          position: absolute;
          top: 0;
          bottom: 0;
          display: block;
          overflow: hidden;
          transform: scale(1);
          transition: transform 900ms cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .panel-1 .frame {
          left: 0;
          right: calc(100% - var(--t1));
        }
        .panel-2 .frame {
          left: calc(var(--b1) - var(--bleed));
          right: calc(100% - var(--t2));
        }
        .panel-3 .frame {
          left: calc(var(--b2) - var(--bleed));
          right: 0;
        }

        .scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.18) 0%,
            rgba(0, 0, 0, 0.02) 35%,
            rgba(0, 0, 0, 0.42) 100%
          );
          opacity: 0.9;
          transition: opacity 500ms ease;
        }

        /* Wedge centroids: mean of the four x-coordinates. */
        .label {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          white-space: nowrap;
          font-family: var(--font-display, 'Cormorant Garamond', Georgia, serif);
          font-size: clamp(1.5rem, 2.6vw, 2.75rem);
          font-weight: 300;
          font-variant-numeric: oldstyle-nums;
          letter-spacing: 0.02em;
          color: #fff;
          text-shadow: 0 1px 24px rgba(0, 0, 0, 0.45);
        }
        .panel-1 .label {
          left: 16%; /* (0 + 36 + 28 + 0) / 4 */
        }
        .panel-2 .label {
          left: 49%; /* (36 + 70 + 62 + 28) / 4 */
        }
        .panel-3 .label {
          left: 83%; /* (70 + 100 + 100 + 62) / 4 */
        }

        .panel:hover .frame,
        .panel:focus-visible .frame {
          transform: scale(1.04);
        }
        .panel:hover .scrim,
        .panel:focus-visible .scrim {
          opacity: 0.55;
        }
        .panel:focus-visible {
          outline: 1px solid rgba(255, 255, 255, 0.9);
          outline-offset: -6px;
        }

        /* Below the fold of a tablet, diagonals just crush the images.
           Stack them with crisp horizontal edges instead. */
        @media (max-width: 768px) {
          .split {
            position: static;
            display: grid;
            grid-template-columns: 1fr;
            height: auto;
          }
          .panel,
          .panel-1,
          .panel-2,
          .panel-3 {
            position: relative;
            inset: auto;
            height: 42vw;
            min-height: 200px;
            clip-path: none;
            z-index: auto;
          }
          .frame,
          .panel-1 .frame,
          .panel-2 .frame,
          .panel-3 .frame {
            inset: 0;
            left: 0;
            right: 0;
          }
          .label,
          .panel-1 .label,
          .panel-2 .label,
          .panel-3 .label {
            left: 50%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .frame {
            transition: none;
          }
          .panel:hover .frame,
          .panel:focus-visible .frame {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}
