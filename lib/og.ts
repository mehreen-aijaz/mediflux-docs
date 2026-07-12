import type { Metadata } from "next";
import ogDocsImage from "@/app/og-docs.png";

/** Shared Open Graph / Twitter preview image for MediFlux Docs. */
export const OG_IMAGE = {
  url: ogDocsImage.src,
  width: ogDocsImage.width,
  height: ogDocsImage.height,
  alt: "MediFlux Documentation — Learn how to use MediFlux efficiently",
} as const;

export const OG_IMAGES: NonNullable<
  NonNullable<Metadata["openGraph"]>["images"]
> = [OG_IMAGE];
