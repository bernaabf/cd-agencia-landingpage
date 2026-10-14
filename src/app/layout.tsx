import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/lib/site";

const cormorant = localFont({
  variable: "--font-cormorant",
  display: "swap",
  src: [
    { path: "../fonts/cormorant-garamond-latin-300-normal.woff2", weight: "300", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-300-italic.woff2", weight: "300", style: "italic" },
    { path: "../fonts/cormorant-garamond-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/cormorant-garamond-latin-500-normal.woff2", weight: "500", style: "normal" },
  ],
});

const manrope = localFont({
  variable: "--font-manrope",
  display: "swap",
  src: "../fonts/manrope-latin-wght-normal.woff2",
  weight: "200 800",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name }],
  keywords: [
    "turismóloga",
    "consultoria de viagens",
    "viagem à Suíça",
    "curadoria de experiências",
    "concierge na Suíça",
    "transfer privativo Suíça",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#3d2521",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: site.name,
  description: site.description,
  url: site.url,
  image: `${site.url}/images/hero-carolina.jpg`,
  areaServed: { "@type": "Country", name: "Suíça" },
  inLanguage: "pt-BR",
  sameAs: [site.instagram.url],
  founder: { "@type": "Person", name: site.name, jobTitle: site.role },
  makesOffer: ["Suíça Sob Medida", "Concierge", "Transfert Privé"].map((name) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name },
  })),
};

/* Marca a página como "js" para ativar os estados iniciais das animações.
   Se o MotionRoot não iniciar em 4s, o conteúdo é liberado. */
const motionGuard = `document.documentElement.classList.add('js');setTimeout(function(){var d=document.documentElement;if(!d.classList.contains('motion-ready')&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.remove('js')}},4000);`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${cormorant.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionGuard }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <a
          href="#inicio"
          className="sr-only z-[60] rounded-full bg-cream-100 px-5 py-3 text-sm font-semibold text-brown-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Ir para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
