"use client";

import { ChevronLeft, ChevronRight, ImageIcon } from "lucide-react";
import { useState } from "react";

function resolveImagePath(source: string) {
  if (source.startsWith("/")) return source;
  if (source.startsWith("images/")) return `/${source}`;
  return `/images/${source}`;
}

export function DetailGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  const safeImages = images.length ? images : [""];
  const activeImage = safeImages[activeIndex] || "";
  const hasMultipleImages = safeImages.length > 1;

  const changeImage = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + safeImages.length) % safeImages.length);
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-xl shadow-gray-200/60">
        {activeImage && !failedImages[activeIndex] ? (
          <img
            src={resolveImagePath(activeImage)}
            alt={`${title} image ${activeIndex + 1}`}
            className="absolute inset-0 h-full w-full object-contain p-6 sm:p-10"
            onError={() => setFailedImages((current) => ({ ...current, [activeIndex]: true }))}
          />
        ) : (
          <div className="relative flex h-full flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-orange-50 via-white to-amber-50 p-8 text-center text-gray-500">
            <div className="absolute h-40 w-40 rounded-full bg-orange-200/40 blur-3xl animate-pulse" />
            <ImageIcon className="relative h-12 w-12 animate-pulse text-orange-300" />
            <p className="max-w-xs text-sm">Product image coming soon. Add the image to the configured gallery path to display it here.</p>
          </div>
        )}

        {hasMultipleImages && (
          <>
            <button type="button" onClick={() => changeImage(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gray-800 shadow-lg transition hover:bg-orange-500 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => changeImage(1)} aria-label="Next image" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-gray-800 shadow-lg transition hover:bg-orange-500 hover:text-white">
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-gray-950/70 px-3 py-2 backdrop-blur-sm">
              {safeImages.map((_, index) => <button type="button" key={index} onClick={() => setActiveIndex(index)} aria-label={`Show image ${index + 1}`} className={`h-1.5 rounded-full transition-all ${index === activeIndex ? "w-6 bg-orange-400" : "w-1.5 bg-white/70"}`} />)}
            </div>
          </>
        )}
      </div>

      {hasMultipleImages && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {safeImages.map((image, index) => (
            <button type="button" key={`${image}-${index}`} onClick={() => setActiveIndex(index)} aria-label={`Select image ${index + 1}`} className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition ${index === activeIndex ? "border-orange-500 shadow-md" : "border-gray-200 hover:border-orange-300"}`}>
              {image && !failedImages[index] ? <img src={resolveImagePath(image)} alt="" className="absolute inset-0 h-full w-full object-contain p-2" onError={() => setFailedImages((current) => ({ ...current, [index]: true }))} /> : <ImageIcon className="absolute inset-0 m-auto h-6 w-6 text-gray-300" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}