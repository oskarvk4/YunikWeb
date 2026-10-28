"use client";

import { useEffect, useState } from "react";

const ROTATE_MS = 5000;

/**
 * One-line strip above the menu on every storefront page. It sits inside the
 * fixed header and is exactly h-8 (2rem); Navbar adds a matching spacer so
 * page content starts below it. Alternates between the messages, except for
 * people who prefer reduced motion, who keep the first one. The messages come
 * from /admin/copy (site.announcement); empty ones are skipped.
 */
export default function AnnouncementBar({ messages: allMessages }: { messages: string[] }) {
  const messages = allMessages.filter((message) => message.trim() !== "");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), ROTATE_MS);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div className="relative h-8 bg-[#1A1A1A] text-[#F5F0EB] overflow-hidden">
      {messages.map((message, i) => (
        <p
          key={message}
          aria-hidden={i !== index}
          className={`absolute inset-0 flex items-center justify-center px-4 font-sans text-[11px] md:text-xs tracking-[0.08em] whitespace-nowrap transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {message}
        </p>
      ))}
    </div>
  );
}
