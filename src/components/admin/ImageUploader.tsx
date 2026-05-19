"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import CropModal from "./CropModal";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

type UploadItem = {
  id: string;
  name: string;
  status: "uploading" | "done" | "error";
  message?: string;
};

function humanizeStorageError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("bucket not found")) {
    return "Storage-bucket 'product-images' findes ikke. Opret den i Supabase Dashboard → Storage.";
  }
  if (m.includes("row-level security") || m.includes("rls")) {
    return "Du har ikke rettigheder til at uploade. Tjek storage RLS-politikker.";
  }
  if (m.includes("payload too large") || m.includes("exceeded")) {
    return "Filen er for stor (maks 10MB).";
  }
  if (m.includes("mime") || m.includes("invalid")) {
    return "Filtypen er ikke tilladt.";
  }
  return message;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [items, setItems] = useState<UploadItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastSummary, setLastSummary] = useState<string | null>(null);
  const [queue, setQueue] = useState<File[]>([]);
  const [current, setCurrent] = useState<{
    file: File;
    url: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  const skippedCountRef = useRef(0);
  const totalCountRef = useRef(0);
  const successCountRef = useRef(0);
  const failCountRef = useRef(0);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    if (!lastSummary) return;
    const t = setTimeout(() => setLastSummary(null), 3500);
    return () => clearTimeout(t);
  }, [lastSummary]);

  const uploadBlob = async (
    blob: Blob,
    originalName: string
  ): Promise<string> => {
    const supabase = createClient();

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const baseName =
      originalName.replace(/\.[^.]+$/, "").slice(0, 40) || "image";
    const filename = `${timestamp}-${randomId}-${baseName}.jpg`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filename, blob, {
        cacheControl: "3600",
        upsert: false,
        contentType: "image/jpeg",
      });

    if (error) {
      throw new Error(error.message);
    }

    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const finalizeBatch = useCallback(() => {
    const parts: string[] = [];
    if (successCountRef.current > 0)
      parts.push(`${successCountRef.current} uploadet`);
    if (failCountRef.current > 0)
      parts.push(`${failCountRef.current} fejlede`);
    if (skippedCountRef.current > 0)
      parts.push(`${skippedCountRef.current} sprunget over`);
    setLastSummary(parts.join(" · ") || null);
    setIsUploading(false);

    window.setTimeout(() => {
      setItems((prev) => prev.filter((it) => it.status !== "done"));
    }, 1200);
  }, []);

  const advance = useCallback(
    (remaining: File[]) => {
      if (current) {
        URL.revokeObjectURL(current.url);
      }
      if (remaining.length === 0) {
        setCurrent(null);
        setQueue([]);
        finalizeBatch();
        return;
      }
      const [next, ...rest] = remaining;
      const url = URL.createObjectURL(next);
      setCurrent({ file: next, url });
      setQueue(rest);
    },
    [current, finalizeBatch]
  );

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        setError("Kun billedfiler er tilladt");
        return;
      }

      const remainingSlots = maxImages - images.length;
      if (remainingSlots <= 0) {
        setError(`Maksimalt ${maxImages} billeder tilladt`);
        return;
      }

      const filesToProcess = imageFiles.slice(0, remainingSlots);
      const overflow = imageFiles.length - filesToProcess.length;

      setError(null);
      setIsUploading(true);
      successCountRef.current = 0;
      failCountRef.current = 0;
      skippedCountRef.current = overflow;
      totalCountRef.current = filesToProcess.length;

      advance(filesToProcess);
    },
    [advance, images.length, maxImages]
  );

  const handleCropConfirm = useCallback(
    async (blob: Blob) => {
      if (!current) return;
      const file = current.file;
      const itemId = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

      setItems((prev) => [
        ...prev,
        { id: itemId, name: file.name, status: "uploading" },
      ]);

      // Move to next immediately so the modal closes for the next file
      advance(queue);

      try {
        const url = await uploadBlob(blob, file.name);
        successCountRef.current += 1;
        onChange([...imagesRef.current, url]);
        setItems((prev) =>
          prev.map((it) =>
            it.id === itemId ? { ...it, status: "done" } : it
          )
        );
      } catch (err) {
        failCountRef.current += 1;
        const raw = err instanceof Error ? err.message : "Ukendt fejl";
        const friendly = humanizeStorageError(raw);
        setError(friendly);
        setItems((prev) =>
          prev.map((it) =>
            it.id === itemId
              ? { ...it, status: "error", message: friendly }
              : it
          )
        );
      }
    },
    [advance, current, onChange, queue]
  );

  const handleCropCancel = useCallback(() => {
    skippedCountRef.current += 1;
    advance(queue);
  }, [advance, queue]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
      // Reset input so same file can be selected again
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleRemove = useCallback(
    (index: number) => {
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    },
    [images, onChange]
  );

  const handleMoveUp = useCallback(
    (index: number) => {
      if (index === 0) return;
      const newImages = [...images];
      [newImages[index - 1], newImages[index]] = [
        newImages[index],
        newImages[index - 1],
      ];
      onChange(newImages);
    },
    [images, onChange]
  );

  const handleMoveDown = useCallback(
    (index: number) => {
      if (index === images.length - 1) return;
      const newImages = [...images];
      [newImages[index], newImages[index + 1]] = [
        newImages[index + 1],
        newImages[index],
      ];
      onChange(newImages);
    },
    [images, onChange]
  );

  return (
    <div className="space-y-4">
      {current && (
        <CropModal
          imageSrc={current.url}
          fileName={current.file.name}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragging
              ? "border-accent bg-accent/5"
              : "border-dark/20 hover:border-dark/40"
          }
          ${isUploading ? "pointer-events-none opacity-60" : ""}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        {isUploading ? (
          <div className="space-y-3">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-dark">
              Uploader {items.filter((i) => i.status === "uploading").length} fil(er)…
            </p>
            <div className="h-1.5 bg-dark/10 rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{
                  width: `${
                    items.length === 0
                      ? 0
                      : (items.filter((i) => i.status !== "uploading").length /
                          items.length) *
                        100
                  }%`,
                }}
              />
            </div>
          </div>
        ) : (
          <>
            <svg
              className="w-10 h-10 mx-auto text-dark/40 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm text-dark/60">
              <span className="font-medium text-dark">
                Træk billeder hertil
              </span>{" "}
              eller klik for at vælge
            </p>
            <p className="text-xs text-dark/40 mt-1">
              PNG, JPG, WebP op til 10MB
            </p>
          </>
        )}
      </div>

      {/* Per-file feedback */}
      {items.length > 0 && (
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li
              key={it.id}
              className={`flex items-center gap-3 text-sm px-3 py-2 rounded ${
                it.status === "error"
                  ? "bg-red-50 text-red-700"
                  : it.status === "done"
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-50 text-dark/70"
              }`}
            >
              {it.status === "uploading" && (
                <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
              )}
              {it.status === "done" && (
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {it.status === "error" && (
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
              <span className="truncate flex-1">{it.name}</span>
              {it.message && (
                <span className="text-xs opacity-80">{it.message}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Last batch summary */}
      {lastSummary && !error && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
          {lastSummary}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M5.07 19h13.86a2 2 0 001.74-2.99l-6.93-12a2 2 0 00-3.48 0l-6.93 12A2 2 0 005.07 19z"
            />
          </svg>
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
            aria-label="Luk"
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
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url, index) => (
            <div
              key={url}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <Image
                src={url}
                alt={`Billede ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Overlay with actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Move up */}
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => handleMoveUp(index)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Flyt op"
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
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                )}

                {/* Move down */}
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => handleMoveDown(index)}
                    className="p-2 bg-white rounded-full hover:bg-gray-100"
                    title="Flyt ned"
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
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                )}

                {/* Remove */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  title="Fjern billede"
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
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Index badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
                  Primær
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Image count */}
      <div className="flex items-center justify-between text-xs text-dark/50">
        <span>
          <span className="font-medium text-dark">{images.length}</span> af{" "}
          {maxImages} billeder
        </span>
        {images.length > 0 && (
          <span className="text-dark/40">Første billede er primært</span>
        )}
      </div>
    </div>
  );
}
