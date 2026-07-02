"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePosition({ x, y });
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    if (idx !== selectedIndex && idx >= 0 && idx < images.length) {
      setSelectedIndex(idx);
    }
  };

  const goPrev = () => {
    setIsZoomed(false);
    setSelectedIndex((i) => (i - 1 + images.length) % images.length);
  };
  const goNext = () => {
    setIsZoomed(false);
    setSelectedIndex((i) => (i + 1) % images.length);
  };

  useEffect(() => {
    if (images.length < 2) return;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === "ArrowLeft") {
        setIsZoomed(false);
        setSelectedIndex((i) => (i - 1 + images.length) % images.length);
      }
      if (e.key === "ArrowRight") {
        setIsZoomed(false);
        setSelectedIndex((i) => (i + 1) % images.length);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length]);

  return (
    <div className="space-y-4">
      {/* Mobile: swipe gallery */}
      <div className="md:hidden">
        <div
          ref={mobileScrollRef}
          onScroll={handleMobileScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide touch-pan-x"
        >
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square w-full shrink-0 snap-center bg-[#F5F0EB]"
            >
              <Image
                src={image}
                alt={`${productName} - Image ${index + 1}`}
                fill
                priority={index === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {images.length > 1 && (
          <div className="flex justify-center items-center gap-2 mt-4">
            {images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Vis billede ${index + 1}`}
                      onClick={() => {
                        setIsZoomed(false);
                        const el = mobileScrollRef.current;
                        if (!el) return;
                        el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
                }}
                className={`block rounded-full transition-all duration-300 ${
                  selectedIndex === index
                    ? "w-6 h-1.5 bg-[#1A1A1A]"
                    : "w-1.5 h-1.5 bg-[#1A1A1A]/30"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: click thumbnails + hover zoom */}
      <div className="hidden md:block space-y-4">
        <div
          className="group relative aspect-square bg-[#F5F0EB] overflow-hidden cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-full"
            >
              <Image
                src={images[selectedIndex]}
                alt={`${productName} - Image ${selectedIndex + 1}`}
                fill
                priority
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIhAAAgEDBAMBAAAAAAAAAAAAAQIDAAQRBRIhMQYTQWH/xAAVAQEBAAAAAAAAAAAAAAAAAAADBP/EABkRAAIDAQAAAAAAAAAAAAAAAAECAAMRIf/aAAwDAQACEQMRAD8AzrTtYvdOvI7m2upIZ0yFkQ4Iz3/eanXvnGv3t3NcTalM0kzl3Y9kkk/aUpOiupFCx2I8mf/Z"
                className="object-cover transition-transform duration-300"
                style={
                  isZoomed
                    ? {
                        transform: "scale(2)",
                        transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                      }
                    : undefined
                }
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
          </AnimatePresence>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                aria-label="Forrige billede"
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/85 backdrop-blur text-[#1A1A1A] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Næste billede"
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full bg-white/85 backdrop-blur text-[#1A1A1A] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer hover:bg-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A1A]"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {images.length > 1 && (
          <div className="flex gap-3">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsZoomed(false);
                  setSelectedIndex(index);
                }}
                className={`relative w-20 h-20 bg-[#F5F0EB] overflow-hidden transition-all duration-300 cursor-pointer outline-none ${
                  selectedIndex === index
                    ? "ring-2 ring-[#1A1A1A] ring-offset-2"
                    : "opacity-60 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[#1A1A1A] focus-visible:ring-offset-2 focus-visible:opacity-100"
                }`}
              >
                <Image
                  src={image}
                  alt={`${productName} - Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
