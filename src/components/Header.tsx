"use client";

import Image from "next/image";
import { generalMessage, navLinks, site, whatsappLink } from "@/lib/site";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.surface} aria-hidden="true" />
      <nav data-nav aria-label="Principal" className={styles.nav}>
        <a href="#inicio" className={styles.brand} aria-label={`${site.name} — ir para o início`}>
          <Image src="/images/logo-mark.png" alt="" width={26} height={28} />
          <span>{site.name}</span>
        </a>
        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a className={styles.link} href={`#${link.id}`}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <a className={`${styles.link} ${styles.cta}`} href={whatsappLink(generalMessage)} target="_blank" rel="noopener noreferrer">
            {site.contactCta}<span className="sr-only"> (abre em nova aba)</span>
          </a>
          <button type="button" className={styles.control} disabled>Menu</button>
        </div>
      </nav>
    </header>
  );
}
