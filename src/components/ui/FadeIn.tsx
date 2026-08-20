"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 30 },
  down: { x: 0, y: -30 },
  left: { x: -30, y: 0 },
  right: { x: 30, y: 0 },
  none: { x: 0, y: 0 },
};

interface FadeInProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  inView?: boolean;
  viewportMargin?: string;
  id?: string;
}

export default function FadeIn({
  children,
  direction = "up",
  delay = 0,
  duration = 0.8,
  className,
  inView = true,
  viewportMargin = "-100px",
  id,
}: FadeInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!inView);

  useEffect(() => {
    if (!inView) {
      setVisible(true);
      return;
    }
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: viewportMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [inView, viewportMargin]);

  const offset = offsets[direction];
  const style: React.CSSProperties = {
    opacity: visible ? 1 : 0,
    transform: visible ? "none" : `translate(${offset.x}px, ${offset.y}px)`,
    transition: `opacity ${duration}s ease-out ${delay}s, transform ${duration}s ease-out ${delay}s`,
    willChange: visible ? undefined : "opacity, transform",
  };

  return (
    <div ref={ref} id={id} className={className} style={style}>
      {children}
    </div>
  );
}
