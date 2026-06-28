import { type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ZoomableImage } from "@/components/mdx/zoomable-image";

function getYouTubeId(input: string) {
  if (!input.includes("youtube.com") && !input.includes("youtu.be")) {
    return input;
  }

  try {
    const url = new URL(input);
    if (url.hostname === "youtu.be") {
      return url.pathname.slice(1);
    }

    return url.searchParams.get("v") ?? url.pathname.split("/").pop() ?? input;
  } catch {
    return input;
  }
}

function MediaFigure({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  const hasCaption = Boolean(title || description);

  return (
    <figure className={cn("media-figure my-8", className)}>
      <div className="overflow-hidden rounded-xl border border-border !bg-muted/60 shadow-sm">
        <div
          className={cn(
            "flex items-center justify-center bg-muted/60 m-1.5 sm:m-2 border !border-gray-300 rounded-md",
          )}
        >
          <div className="w-full">{children}</div>
        </div>
        {hasCaption && (
          <figcaption className="!bg-muted/60 !p-1.5 text-center !sm:p-2 !pb-3">
            {title && (
              <p className="text-sm font-semibold text-heading !m-0 !-mt-1">
                {title}
              </p>
            )}
            {description && (
              <p
                className={cn(
                  "text-sm leading-relaxed text-muted-foreground !m-0",
                  title && "mt-1.5"
                )}
              >
                {description}
              </p>
            )}
          </figcaption>
        )}
      </div>
    </figure>
  );
}

export function MdxImage({
  src,
  alt,
  className,
}: ComponentProps<"img">) {
  if (!src || typeof src !== "string") return null;

  return (
    <MediaFigure title={alt}>
      <ZoomableImage src={src} alt={alt ?? ""} className={className} />
    </MediaFigure>
  );
}

interface FigureProps {
  src: string;
  title: string;
  description?: string;
  alt?: string;
  className?: string;
}

export function Figure({ src, title, description, alt, className }: FigureProps) {
  return (
    <MediaFigure title={title} description={description} className={className}>
      <ZoomableImage src={src} alt={alt ?? title} />
    </MediaFigure>
  );
}

interface YouTubeProps {
  id?: string;
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function YouTube({
  id,
  url,
  title = "YouTube video",
  description,
  className,
}: YouTubeProps) {
  const videoId = id ?? (url ? getYouTubeId(url) : "");

  if (!videoId) return null;

  return (
    <MediaFigure title={title} description={description} className={className}>
      <div className="media-figure__media relative aspect-video w-full overflow-hidden rounded-md bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
        />
      </div>
    </MediaFigure>
  );
}

interface VideoProps {
  src: string;
  title?: string;
  description?: string;
  className?: string;
}

export function Video({ src, title, description, className }: VideoProps) {
  const accessibleTitle = title ?? "Hosted video";

  return (
    <MediaFigure title={title} description={description} className={className}>
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        title={accessibleTitle}
        className="media-figure__media aspect-video w-full overflow-hidden rounded-md bg-black"
      >
        Your browser does not support embedded videos.
      </video>
    </MediaFigure>
  );
}
