import Image from "next/image";
import Button from "@/components/Button";
import { InstagramIcon, WhatsAppIcon } from "@/components/Icons";
import MediaFrame from "@/components/MediaFrame";
import { closing, generalMessage, navLinks, site, whatsappLink } from "@/lib/site";
import styles from "./Editorial.module.css";

const social = [
  { name: "WhatsApp", label: "Conversar pelo WhatsApp", href: whatsappLink(generalMessage), Icon: WhatsAppIcon },
  { name: "Instagram", label: "Abrir o Instagram", href: site.instagram.url, Icon: InstagramIcon },
] as const;

export default function Contact() {
  return (
    <section
      id="contato"
      tabIndex={-1}
      data-world-act="silence"
      aria-labelledby="contato-title"
      className={`relative bg-brown-900 pb-10 text-cream-50 ${styles.scope} ${styles.contactSection}`}
    >
      <div className={styles.container}>
        <div className={styles.closingGrid}>
          <h2
            id="contato-title"
            data-split
            className={`display ${styles.heading} ${styles.closingTitle}`}
          >
            {closing.title}
          </h2>
          <div>
            <p data-reveal className={`text-base leading-[1.8] text-cream-100/85 ${styles.closingCopy}`}>
              {closing.text}
            </p>
            <div data-reveal className="mt-7">
              <Button href={whatsappLink(generalMessage)}>{closing.cta}</Button>
            </div>
            <ul data-reveal className={styles.socialList}>
              {social.map(({ name, label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${label} (abre em nova aba)`}
                    className={styles.socialLink}
                  >
                    <Icon className="size-5" />
                    <span>{name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div data-world-act="summit" className={styles.contactImage}>
          <MediaFrame
            src="/images/mapa-rota.jpg"
            alt="Carolina Décaillet sorrindo enquanto planeja uma viagem sobre um mapa da Suíça"
            sizes="(min-width: 1280px) 1200px, 94vw"
            parallax={7}
            objectPosition="50% 100%"
            className="aspect-[4/3] w-full sm:aspect-[16/9] lg:aspect-[2/1]"
          />
        </div>
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
                    className={`text-[0.7rem] font-medium uppercase tracking-[0.16em] text-cream-100/75 transition-colors hover:text-cream-50 ${styles.footerLink}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs leading-relaxed tracking-[0.04em] text-sand-400">
          © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
        </p>
      </footer>
    </section>
  );
}
