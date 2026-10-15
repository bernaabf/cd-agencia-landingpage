"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { getLenis, scrollToSection } from "@/lib/scroll";
import { generalMessage, navLinks, site, whatsappLink } from "@/lib/site";
import styles from "./Header.module.css";

type Props = { open: boolean; close: () => void; trigger: RefObject<HTMLButtonElement | null> };

export default function MenuOverlay({ open, close, trigger }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const controller = useRef<{ enter: () => void; leave: () => void } | null>(null);
  const destination = useRef<string | null>(null);

  useLayoutEffect(() => {
    const element = dialog.current!;
    let release: (() => void) | null = null;
    const finish = () => {
      element.close();
      release?.();
      release = null;
      trigger.current?.focus({ preventScroll: true });
      if (destination.current) {
        scrollToSection(destination.current);
        destination.current = null;
      }
    };
    const ctx = gsap.context((context) => {
      context.add("enter", () => {
        gsap.killTweensOf(element);
        if (!element.open) {
          const html = document.documentElement, body = document.body;
          const overflow = html.style.overflow, bodyOverflow = body.style.overflow, padding = body.style.paddingRight;
          const gap = window.innerWidth - html.clientWidth;
          const originalPadding = parseFloat(getComputedStyle(body).paddingRight) || 0;
          const lenis = getLenis(), stopped = lenis?.isStopped;
          lenis?.stop();
          html.style.overflow = "hidden";
          body.style.overflow = "hidden";
          if (gap) body.style.paddingRight = `${originalPadding + gap}px`;
          release = () => {
            html.style.overflow = overflow;
            body.style.overflow = bodyOverflow;
            body.style.paddingRight = padding;
            if (lenis === getLenis() && !stopped) lenis?.start();
          };
          element.showModal();
        }
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        gsap.fromTo(element, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.3, overwrite: true });
        gsap.fromTo(element.querySelectorAll("[data-menu-line]"), { y: reduced ? 0 : 32, opacity: 0 }, { y: 0, opacity: 1, duration: reduced ? 0 : 0.55, stagger: reduced ? 0 : 0.08, ease: "power3.out", overwrite: true });
      });
      context.add("leave", () => {
        if (!element.open) return;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        gsap.to(element, { opacity: 0, duration: reduced ? 0 : 0.3, overwrite: true, onComplete: finish });
      });
      controller.current = { enter: () => context.enter(), leave: () => context.leave() };
    }, element);
    return () => { ctx.revert(); if (element.open) element.close(); release?.(); controller.current = null; };
  }, [trigger]);

  useLayoutEffect(() => {
    if (open) controller.current?.enter();
    else controller.current?.leave();
  }, [open]);

  return (
    <dialog ref={dialog} id="site-menu" className={styles.dialog} aria-modal="true" aria-labelledby="menu-title"
      onCancel={(event) => { event.preventDefault(); close(); }}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const items = Array.from(dialog.current!.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }}>
      <div className={styles.menuFrame}>
        <div className={styles.menuTop}>
          <p id="menu-title" className={styles.brand}>{site.name}</p>
          <button type="button" className={styles.control} onClick={close} autoFocus>Fechar</button>
        </div>
        <nav aria-label="Menu principal">
          <ul className={styles.menuLinks}>{navLinks.map((link) => (
            <li key={link.id}><a data-menu-line href={`#${link.id}`} onClick={(event) => {
              if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault(); destination.current = link.id; close();
            }}>{link.label}</a></li>
          ))}</ul>
        </nav>
        <footer className={styles.menuFooter}>
          <p>{site.tagline}<br />{site.role}</p>
          <div>
            <a className={styles.link} href={whatsappLink(generalMessage)} target="_blank" rel="noopener noreferrer">{site.contactCta}<span className="sr-only"> (abre em nova aba)</span></a>
            <a className={styles.link} href={site.instagram.url} target="_blank" rel="noopener noreferrer">Instagram<span className="sr-only"> @{site.instagram.handle} (abre em nova aba)</span></a>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
