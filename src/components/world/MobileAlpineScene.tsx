import { getImageProps } from "next/image";
import { preload } from "react-dom";
import type { Paisagem } from "@/data/paisagens";
import { mobilePresentationQuery } from "@/lib/presentation";

// Existing gallery variants are already encoded; media prevents desktop downloads.
const widths = [480, 768, 1080];
const transparent = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";

export default function MobileAlpineScene({ landscape }: { landscape: Paisagem }) {
  const { props } = getImageProps({ src: transparent, alt: "", fill: true, unoptimized: true,
    loading: "eager", fetchPriority: "high", sizes: "100vw",
    style: { objectFit: "cover", objectPosition: "50% 42%" } });
  const avif = widths.map(width => `${landscape.src}-${width}.avif ${width}w`).join(", ");
  preload(`${landscape.src}-768.avif`, { as: "image", type: "image/avif", media: mobilePresentationQuery,
    fetchPriority: "high", imageSrcSet: avif, imageSizes: "100vw" });
  return <div className="mobile-alpine-scene" aria-hidden="true">
    <picture>
      <source media={mobilePresentationQuery} type="image/avif"
        srcSet={avif} sizes="100vw" />
      <source media={mobilePresentationQuery} type="image/webp"
        srcSet={widths.map(width => `${landscape.src}-${width}.webp ${width}w`).join(", ")} sizes="100vw" />
      <source media={mobilePresentationQuery}
        srcSet={widths.map(width => `${landscape.src}-${width}.jpg ${width}w`).join(", ")} sizes="100vw" />
      {/* Art direction via Next getImageProps keeps the LCP image free of hydration handlers. */}
      <img {...props} alt="" />
    </picture>
  </div>;
}
