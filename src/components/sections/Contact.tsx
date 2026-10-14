import Image from "next/image";
import Button from "@/components/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/Icons";
import MediaFrame from "@/components/MediaFrame";
import { closing, generalMessage, navLinks, site, whatsappLink } from "@/lib/site";
import styles from "./Editorial.module.css";

const social = [
  { label: "Conversar pelo WhatsApp", href: whatsappLink(generalMessage), Icon: WhatsAppIcon },
  { label: "Abrir o Instagram", href: site.instagram.url, Icon: InstagramIcon },
] as const;

export default function Contact() {
  return (
    <>
      {/* Faixa fotográfica com parallax */}
      <div data-world-act="summit" className="bg-brown-900 px-5 pb-6 sm:px-8 sm:pb-10">
        <div className="mx-auto max-w-6xl">
          <MediaFrame
            src="/images/mapa-rota.jpg"
            alt="Mãos traçando uma rota sobre um mapa em relevo da Suíça"
            sizes="(min-width: 1152px) 1152px, 92vw"
            parallax={7}
            objectPosition="50% 55%"
            className="aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[2/1]"
          />
        </div>
      </div>

      <section
        id="contato"
        data-world-act="silence"
        aria-labelledby="contato-title"
        className={`relative isolate overflow-hidden bg-brown-900 pb-10 text-cream-50 ${styles.scope} ${styles.contactSection}`}
      >
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_50%_0%,rgba(200,180,160,0.12),transparent_70%),linear-gradient(to_bottom,transparent,rgba(42,24,21,0.9))]"
        />

        <div className={`text-center ${styles.container} ${styles.closing}`}>
          <h2
            id="contato-title"
            data-split
            className={`display ${styles.heading}`}
          >
            {closing.title}
          </h2>
          <p
            data-reveal
            className="mx-auto mt-7 max-w-[52ch] text-[1.02rem] leading-[1.8] text-cream-100/85"
          >
            {closing.text}
          </p>
          <div data-reveal className="mt-10 flex justify-center">
            <Button href={whatsappLink(generalMessage)}>{closing.cta}</Button>
          </div>

          <ul data-reveal className="mt-10 flex items-center justify-center gap-4">
            {social.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (abre em nova aba)`}
                  className="glass-light group grid size-14 place-items-center rounded-full text-cream-50 transition-[translate,scale,background-color] duration-500 ease-premium hover:-translate-y-1 hover:bg-white/25 active:scale-95"
                >
                  <Icon className="size-6 transition-transform duration-500 ease-premium group-hover:scale-110" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <footer className={`mt-24 ${styles.container}`}>
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
            <div className="flex items-center gap-3">
              <Image src="/images/logo-mark.png" alt="" width={26} height={28} className="h-7 w-auto" />
              <div>
                <p className="font-display text-lg uppercase tracking-[0.14em]">{site.name}</p>
                <p className="text-[0.68rem] tracking-[0.12em] text-sand-400">
                  {site.role} | {site.tagline}
                </p>
              </div>
            </div>
            <nav aria-label="Rodapé">
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-cream-100/75 transition-colors hover:text-cream-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <p className="mt-8 text-center text-[0.68rem] tracking-[0.1em] text-cream-100/50">
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
        </footer>
      </section>
    </>
  );
}
