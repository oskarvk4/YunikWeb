"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

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
  // When true, animates on scroll-into-view; when false, animates immediately on mount.
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
  const offset = offsets[direction];
  const initial = { opacity: 0, ...offset };
  const target = { opacity: 1, x: 0, y: 0 };
  const transition = { duration, delay };

  if (inView) {
    return (
      <motion.div
        id={id}
        initial={initial}
        whileInView={target}
        viewport={{ once: true, margin: viewportMargin }}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      id={id}
      initial={initial}
      animate={target}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
