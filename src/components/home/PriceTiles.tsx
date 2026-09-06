"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./PriceTiles.module.css";

interface Tile {
  label: string;
  min?: number;
  max?: number;
  image: string;
  alt: string;
  objectPosition: string;
}

const TILES: Tile[] = [
  {
    label: "500–700 kr",
    min: 500,
    max: 700,
    image: "/yunik-19.webp",
    alt: "Smykker i prisleje 500 til 700 kroner",
    objectPosition: "60% 40%",
  },
  {
    label: "700–1.000 kr",
    min: 700,
    max: 1000,
    image: "/yunik-16.webp",
    alt: "Smykker i prisleje 700 til 1.000 kroner",
    objectPosition: "50% 50%",
  },
  {
    label: "1.000+ kr",
    min: 1000,
    image: "/yunik-13.webp",
    alt: "Smykker fra 1.000 kroner og opefter",
    objectPosition: "50% 45%",
  },
];

function buildHref(tile: Tile) {
  const params = new URLSearchParams();
  if (tile.min !== undefined) params.set("minPrice", String(tile.min));
  if (tile.max !== undefined) params.set("maxPrice", String(tile.max));
  return `/shop?${params.toString()}`;
}

export default function PriceTiles() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="text-center mb-12 md:mb-16 px-4">
        <p className="text-sm font-sans uppercase tracking-[0.3em] text-[#8D6553] mb-4">
          Find efter pris
        </p>
        <h2 className="font-serif text-3xl md:text-4xl font-light text-[#1A1A1A]">
          Et smykke til enhver anledning
        </h2>
      </div>

      <div className={styles.split} aria-label="Shop efter prisniveau">
        {TILES.map((tile) => (
          <Link
            key={tile.label}
            href={buildHref(tile)}
            className={styles.panel}
          >
            <span className={styles.frame}>
              <Image
                src={tile.image}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: tile.objectPosition }}
              />
              <span className={styles.scrim} />
            </span>
            <span className={styles.label}>{tile.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
