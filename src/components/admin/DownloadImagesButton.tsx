"use client";

import { useState } from "react";

interface DownloadImagesButtonProps {
  slug: string;
  name: string;
  images: string[];
}

function extensionFromUrl(url: string, fallback = "jpg"): string {
  try {
    const path = new URL(url, "http://x").pathname;
    const match = path.match(/\.([a-zA-Z0-9]{2,5})$/);
    return match ? match[1].toLowerCase() : fallback;
  } catch {
    return fallback;
  }
}

export default function DownloadImagesButton({
  slug,
  name,
  images,
}: DownloadImagesButtonProps) {
  const [status, setStatus] = useState<"idle" | "downloading" | "error">("idle");

  const handleDownload = async () => {
    if (!images.length || status === "downloading") return;
    setStatus("downloading");
    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();
      const folder = zip.folder(slug);
      if (!folder) throw new Error("Kunne ikke oprette mappe i ZIP.");

      await Promise.all(
        images.map(async (src, i) => {
          const response = await fetch(src);
          if (!response.ok) {
            throw new Error(`Kunne ikke hente billede ${i + 1}`);
          }
          const blob = await response.blob();
          const ext = extensionFromUrl(src);
          folder.file(`${slug}-${i + 1}.${ext}`, blob);
        })
      );

      const archive = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(archive);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch (err) {
      console.error("Download failed", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const isDisabled = images.length === 0 || status === "downloading";

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isDisabled}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-white border border-dark/20 text-dark hover:bg-dark hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-dark disabled:cursor-not-allowed"
      aria-label={`Download billeder for ${name} som ZIP`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
        />
      </svg>
      {status === "downloading"
        ? "Pakker..."
        : status === "error"
        ? "Fejl – prøv igen"
        : images.length === 0
        ? "Ingen billeder"
        : `Download billeder (${images.length})`}
    </button>
  );
}
