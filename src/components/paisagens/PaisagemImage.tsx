"use client";
import Image, { type ImageLoaderProps } from "next/image";
import type { Paisagem } from "@/data/paisagens";
const widths = [480, 768, 1080, 1600, 2400];
const loader = ({ src, width }: ImageLoaderProps) => `${src}-${widths.find(w => w >= width) ?? 2400}.jpg`;
export default function PaisagemImage({ paisagem, sizes, contain = false, eager = false }: {
  paisagem: Paisagem; sizes: string; contain?: boolean; eager?: boolean;
}) {
  return <picture>
    <source type="image/avif" srcSet={widths.map(w => `${paisagem.src}-${w}.avif ${w}w`).join(", ")} sizes={sizes} />
    <source type="image/webp" srcSet={widths.map(w => `${paisagem.src}-${w}.webp ${w}w`).join(", ")} sizes={sizes} />
    <Image loader={loader} src={paisagem.src} fill alt={paisagem.alt} sizes={sizes}
      loading={eager ? "eager" : "lazy"} placeholder="blur" blurDataURL={paisagem.blurDataURL}
      style={{ objectFit: contain ? "contain" : "cover", objectPosition: `${paisagem.foco?.x ?? 50}% ${paisagem.foco?.y ?? 50}%` }} />
  </picture>;
}
