"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function ZoomableImage({ src, alt, className }: ZoomableImageProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={cn(
          "media-figure__media block h-auto w-full cursor-zoom-in",
          className
        )}
        onClick={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`View full size: ${alt || "image"}`}
      />

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] cursor-zoom-out bg-background"
            role="dialog"
            aria-modal="true"
            aria-label={alt || "Full size image"}
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              className={cn(
                "absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-md !p-1 hover:bg-muted",
                "bg-white border border-border text-muted-foreground backdrop-blur-sm",
                "transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
              )}
              aria-label="Close full size image"
            >
              <X className="size-5" aria-hidden />
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="size-full object-contain"
            />
          </div>,
          document.body
        )}
    </>
  );
}
