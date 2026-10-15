"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollToSection } from "@/lib/scroll";
import Image from "next/image";
import { generalMessage, navLinks, site, whatsappLink } from "@/lib/site";
import MenuOverlay from "./MenuOverlay";
import styles from "./Header.module.css";

export default function Header() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  const root = useRef<HTMLElement>(null);
  const surface = useRef<HTMLDivElement>(null);
  const show = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context((context) => {
      const mm = gsap.matchMedia();
      mm.add({ reduced: "(prefers-reduced-motion: reduce)", full: "(prefers-reduced-motion: no-preference)" }, (media) => {
        const reduced = Boolean(media.conditions?.reduced);
        let heroEnd = 0, last = window.scrollY, hidden = false, solid: boolean | undefined;
        const reveal = (next: boolean) => {
          if (hidden === next) return;
          hidden = next;
          root.current!.dataset.hidden = String(next);
          gsap.to(root.current, { yPercent: reduced ? 0 : next ? -100 : 0, opacity: reduced && next ? 0 : 1, duration: reduced ? 0 : 0.4, ease: "power3.out", overwrite: true });
        };
        context.add("show", () => reveal(false));
        show.current = () => context.show();
        const update = (y: number) => {
          const nextSolid = y >= heroEnd;
          if (solid !== nextSolid) {
            solid = nextSolid;
            root.current!.dataset.surface = solid ? "solid" : "transparent";
            gsap.to(surface.current, { opacity: solid ? 1 : 0, duration: solid && !reduced ? 0.3 : 0, overwrite: true });
          }
          if (Math.abs(y - last) > 12 || y < 88) {
            reveal(y > 88 && y > last && !root.current?.querySelector(":focus-visible"));
            last = y;
          }
        };
        const measure = () => {
          const hero = document.getElementById("inicio");
          heroEnd = hero ? hero.offsetTop + hero.offsetHeight : 0;
          update(window.scrollY);
        };
        measure();
        ScrollTrigger.create({ start: 0, end: "max", onUpdate: (self) => update(self.scroll()), onRefresh: measure });
      });
    }, root);
    return () => ctx.revert();
  }, []);
  const navigate = (event: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    scrollToSection(id);
  };
  return (
    <>
    <header ref={root} className={styles.header} onFocusCapture={() => show.current()}>
      <div ref={surface} className={styles.surface} aria-hidden="true" />
      <nav data-nav aria-label="Principal" className={styles.nav}>
        <a href="#inicio" onClick={(event) => navigate(event, "inicio")} className={styles.brand} aria-label={`${site.name} — ir para o início`}>
          <Image src="/images/logo-mark.png" alt="" width={26} height={28} />
          <span>{site.name}</span>
        </a>
        <ul className={styles.links}>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a className={styles.link} href={`#${link.id}`} onClick={(event) => navigate(event, link.id)}>{link.label}</a>
            </li>
          ))}
        </ul>
        <div className={styles.actions}>
          <a className={`${styles.link} ${styles.cta}`} href={whatsappLink(generalMessage)} target="_blank" rel="noopener noreferrer">
            {site.contactCta}<span className="sr-only"> (abre em nova aba)</span>
          </a>
          <button ref={toggle} type="button" className={styles.control} aria-expanded={open} aria-controls="site-menu" aria-haspopup="dialog" onClick={() => { show.current(); setOpen(true); }}>Menu</button>
        </div>
      </nav>
    </header>
    <MenuOverlay open={open} close={() => { show.current(); setOpen(false); }} trigger={toggle} />
    </>
  );
}
