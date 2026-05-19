"use client";

import { useState, useCallback } from "react";
import Cropper, { Area } from "react-easy-crop";
import { getCroppedBlob } from "@/lib/cropImage";

interface CropModalProps {
  imageSrc: string;
  fileName: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

export default function CropModal({
  imageSrc,
  fileName,
  onConfirm,
  onCancel,
}: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[95vh] my-auto">
        <div className="px-6 py-4 border-b border-dark/10 flex items-center justify-between flex-shrink-0">
          <div className="min-w-0">
            <h2 className="font-serif text-lg text-dark">Beskær billede</h2>
            <p className="text-sm text-dark/60 truncate">{fileName}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="text-dark/60 hover:text-dark p-1 disabled:opacity-50"
            aria-label="Luk"
          >
            <svg
              className="w-5 h-5"
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

        <div className="relative w-full bg-gray-900 flex-1 min-h-[260px] h-[clamp(260px,45vh,460px)]">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            showGrid
            objectFit="contain"
          />
        </div>

        <div className="px-6 py-4 border-t border-dark/10 space-y-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <label className="text-sm text-dark/70 w-12 flex-shrink-0">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={4}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-dark"
              disabled={isProcessing}
            />
            <span className="text-sm text-dark/60 w-10 text-right">
              {zoom.toFixed(1)}x
            </span>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isProcessing}
              className="px-5 py-2.5 border border-dark/20 text-dark hover:border-dark/40 hover:bg-gray-50 font-medium rounded transition-colors disabled:opacity-50"
            >
              Annuller
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={isProcessing || !croppedAreaPixels}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-dark/20 text-dark hover:border-dark/40 hover:bg-gray-50 font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <span className="w-4 h-4 border-2 border-dark border-t-transparent rounded-full animate-spin" />
                  <span>Behandler…</span>
                </>
              ) : (
                <>
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span>Brug billede</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
