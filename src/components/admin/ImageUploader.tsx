"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUploader({
  images,
  onChange,
  maxImages = 10,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const supabase = createClient();

    // Generate unique filename
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const filename = `${timestamp}-${randomId}.${extension}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      throw new Error(error.message);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("product-images")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
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

      const filesToUpload = imageFiles.slice(0, remainingSlots);
      setError(null);
      setIsUploading(true);

      const newUrls: string[] = [];

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];
        setUploadProgress(`Uploader ${i + 1} af ${filesToUpload.length}...`);

        try {
          const url = await uploadFile(file);
          if (url) {
            newUrls.push(url);
          }
        } catch (err) {
          console.error("Failed to upload:", file.name, err);
          setError(`Fejl ved upload af ${file.name}`);
        }
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
      }

      setIsUploading(false);
      setUploadProgress(null);
    },
    [images, maxImages, onChange]
  );

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
          <div className="space-y-2">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-dark/60">{uploadProgress}</p>
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

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
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
      <p className="text-xs text-dark/40">
        {images.length} af {maxImages} billeder
      </p>
    </div>
  );
}
