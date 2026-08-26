"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Product, formatPrice } from "@/types";
import Badge from "@/components/ui/Badge";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const BLUR_DATA_URL =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzrTtYvdOvI7m2upIZ0yFkQ4Iz3/eanXvnGv3t3NcTalM0kzl3Y9kkk/aUpOiupFCx2I8mf/Z";

const IMAGE_SIZES = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw";

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasSecondImage = Boolean(product.images[1]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!hasSecondImage) return;
    const el = scrollRef.current;
    if (!el) return;

    const slots = el.querySelectorAll<HTMLElement>("[data-slot]");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const i = Number((entry.target as HTMLElement).dataset.slot);
            setActiveIndex(i);
          }
        }
      },
      { root: el, threshold: [0.6] }
    );

    slots.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [hasSecondImage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group"
    >
      {/* Product Image */}
      <Link
        href={`/product/${product.slug}`}
        className="block relative aspect-square overflow-hidden bg-[#F5F0EB] mb-4 outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2"
      >
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">
          {product.oneOfOne && <Badge variant="unique">Unik</Badge>}
          {product.newArrival && !product.oneOfOne && <Badge variant="new">Nyhed</Badge>}
          {product.featured && !product.newArrival && !product.oneOfOne && (
            <Badge variant="bestseller">Bestseller</Badge>
          )}
        </div>

        {/* Desktop (pointer-fine): hover crossfade */}
        <div className="absolute inset-0 hidden [@media(hover:hover)]:block">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority={index < 4}
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className={`object-cover transition-all duration-700 group-hover:scale-105 ${
              hasSecondImage ? "group-hover:opacity-0" : ""
            }`}
            sizes={IMAGE_SIZES}
          />
          {hasSecondImage && (
            <Image
              src={product.images[1]}
              alt={`${product.name} - alternate view`}
              fill
              className="object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-105 group-hover:scale-100"
              sizes={IMAGE_SIZES}
            />
          )}
        </div>

        {/* Touch (pointer-coarse): horizontal scroll-snap carousel */}
        <div className="absolute inset-0 [@media(hover:hover)]:hidden">
          <div
            ref={scrollRef}
            className="flex h-full w-full overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div
              data-slot="0"
              className="relative shrink-0 w-full h-full snap-center"
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                priority={index < 4}
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
                sizes={IMAGE_SIZES}
              />
            </div>
            {hasSecondImage && (
              <div
                data-slot="1"
                className="relative shrink-0 w-full h-full snap-center"
              >
                <Image
                  src={product.images[1]}
                  alt={`${product.name} - alternate view`}
                  fill
                  className="object-cover"
                  sizes={IMAGE_SIZES}
                />
              </div>
            )}
          </div>

          {hasSecondImage && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 pointer-events-none">
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  activeIndex === 0 ? "bg-white" : "bg-white/50"
                }`}
              />
              <span
                aria-hidden
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  activeIndex === 1 ? "bg-white" : "bg-white/50"
                }`}
              />
            </div>
          )}
        </div>

        {/* Desktop hover indicator: thin white underline at bottom of image */}
        <span
          aria-hidden
          className="absolute inset-x-4 bottom-3 h-px bg-white z-10 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out hidden [@media(hover:hover)]:block pointer-events-none"
        />
      </Link>

      {/* Product Info */}
      <div className="text-center">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-sm md:text-base font-medium text-[#1A1A1A] hover:text-[#8D6553] transition-colors focus-visible:text-[#8D6553]">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm font-sans text-[#1A1A1A]/70 mt-1">
          {formatPrice(product.price)}
        </p>
      </div>
    </motion.div>
  );
}
