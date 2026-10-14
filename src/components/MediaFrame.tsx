import Image, { type StaticImageData } from "next/image";

type MediaFrameProps = {
  src: string | StaticImageData;
  alt: string;
  sizes: string;
  /** Proporção/altura do quadro (classes Tailwind). */
  className?: string;
  priority?: boolean;
  /** Intensidade do parallax em % (omitido = sem parallax). */
  parallax?: number;
  /** Quadro do Hero: revelado na entrada, sem ScrollTrigger. */
  hero?: boolean;
  objectPosition?: string;
};

/**
 * Quadro de imagem com máscara de revelação, zoom de entrada,
 * parallax opcional e zoom controlado no hover. As animações são
 * dirigidas pelo MotionRoot via atributos data-*.
 */
export default function MediaFrame({
  src,
  alt,
  sizes,
  className = "",
  priority = false,
  parallax,
  hero = false,
  objectPosition = "center",
}: MediaFrameProps) {
  return (
    <div
      data-mask
      {...(hero ? { "data-hero": "true" } : {})}
      className={`group relative overflow-hidden rounded-[24px] bg-brown-800 ${className}`}
    >
      <div
        {...(parallax ? { "data-parallax": parallax } : {})}
        className={parallax ? "absolute inset-x-0 -inset-y-[8%]" : "absolute inset-0"}
      >
        <div data-reveal-scale className="absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={85}
            style={{ objectPosition }}
            className="object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.04]"
          />
        </div>
      </div>
    </div>
  );
}
