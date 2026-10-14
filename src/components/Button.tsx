import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

type ButtonProps = {
  href: string;
  children: ReactNode;
  /** light: sobre fundos escuros · dark: sobre cards claros */
  variant?: "light" | "dark";
  size?: "md" | "sm";
  external?: boolean;
  className?: string;
};

const variants = {
  light: {
    base: "bg-cream-100 text-brown-900",
    fill: "bg-brown-700",
    hoverText: "group-hover:text-cream-50 group-focus-visible:text-cream-50",
  },
  dark: {
    base: "bg-brown-700 text-cream-50",
    fill: "bg-brown-950",
    hoverText: "",
  },
} as const;

/** Botão com preenchimento no hover, ícone animado e feedback de clique. */
export default function Button({
  href,
  children,
  variant = "light",
  size = "md",
  external = true,
  className = "",
}: ButtonProps) {
  const v = variants[variant];
  const sizing = size === "sm" ? "h-10 px-5 text-[0.68rem]" : "h-12 px-7 text-[0.72rem]";

  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-sans font-semibold uppercase tracking-[0.16em] transition-[scale,box-shadow] duration-500 ease-premium hover:shadow-[0_10px_30px_rgba(20,10,8,0.28)] active:scale-[0.97] ${v.base} ${sizing} ${className}`}
    >
      <span
        aria-hidden
        className={`absolute inset-0 -translate-x-full transition-transform duration-500 ease-premium group-hover:translate-x-0 group-focus-visible:translate-x-0 ${v.fill}`}
      />
      <span className={`relative z-10 transition-colors duration-500 ${v.hoverText}`}>{children}</span>
      <ArrowUpRight
        aria-hidden
        className={`relative z-10 size-3.5 transition-transform duration-500 ease-premium group-hover:-translate-y-0.5 group-hover:translate-x-0.5 ${v.hoverText}`}
      />
      {external && <span className="sr-only"> (abre em nova aba)</span>}
    </a>
  );
}
