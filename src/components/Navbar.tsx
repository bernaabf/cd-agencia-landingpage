"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import Button from "@/components/Button";
import { generalMessage, navLinks, site, whatsappLink } from "@/lib/site";
import { getLenis, scrollToSection } from "@/lib/scroll";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("inicio");
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  /* Encolhe discretamente após iniciar a rolagem */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Link ativo conforme a seção visível */
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.getElementById(l.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const unlock = useCallback(() => {
    document.documentElement.style.overflow = "";
    getLenis()?.start();
  }, []);

  /* Bloqueio de rolagem + foco ao abrir o menu móvel */
  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    getLenis()?.stop();
    // Aguarda a transição de visibilidade do painel antes de mover o foco.
    const timer = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    }, 80);
    return () => {
      window.clearTimeout(timer);
      unlock();
    };
  }, [open, unlock]);

  /* Fecha o menu ao ampliar a tela */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const close = useCallback(
    (returnFocus = false) => {
      setOpen(false);
      unlock();
      if (returnFocus) buttonRef.current?.focus();
    },
    [unlock],
  );

  const handleNav = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (open) close();
    scrollToSection(id);
  };

  /* Escape fecha; Tab permanece dentro do menu aberto */
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      close(true);
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = [
      buttonRef.current,
      ...(panelRef.current?.querySelectorAll<HTMLElement>("a") ?? []),
    ].filter((el): el is HTMLElement => !!el);
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <header
      onKeyDown={onKeyDown}
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-3 md:pt-4"
    >
      {open && (
        <div
          aria-hidden
          onClick={() => close()}
          className="pointer-events-auto fixed inset-0 -z-10 bg-brown-950/55 md:hidden"
        />
      )}

      <nav
        data-nav
        aria-label="Principal"
        className={`glass-dark pointer-events-auto flex w-full max-w-5xl items-center justify-between rounded-full pl-5 pr-2 transition-[padding,background-color] duration-500 ease-premium md:pr-2.5 ${
          scrolled ? "bg-brown-900/90! py-1.5" : "py-2.5"
        }`}
      >
        <a
          href="#inicio"
          onClick={(e) => handleNav(e, "inicio")}
          className="flex items-center gap-2.5"
          aria-label={`${site.name} — ir para o início`}
        >
          <Image
            src="/images/logo-mark.png"
            alt=""
            width={26}
            height={28}
            className="h-7 w-auto"
          />
          <span className="font-display text-[1.02rem] font-normal uppercase tracking-[0.14em] text-cream-50 sm:text-[1.15rem]">
            {site.name}
          </span>
        </a>

        <div className="flex items-center gap-1">
          <ul className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={(e) => handleNav(e, link.id)}
                  aria-current={active === link.id ? "location" : undefined}
                  className={`relative block px-3.5 py-2 text-[0.72rem] font-medium uppercase tracking-[0.16em] transition-opacity duration-300 after:absolute after:inset-x-3.5 after:bottom-1 after:h-px after:origin-left after:bg-cream-100 after:transition-transform after:duration-500 after:ease-premium hover:opacity-100 ${
                    active === link.id
                      ? "opacity-100 after:scale-x-100"
                      : "opacity-70 after:scale-x-0 hover:after:scale-x-100"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block lg:pl-2">
            <Button href={whatsappLink(generalMessage)} size="sm">
              {site.contactCta}
            </Button>
          </div>

          <button
            ref={buttonRef}
            type="button"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => (open ? close() : setOpen(true))}
            className="relative grid size-11 place-items-center rounded-full transition-colors duration-300 hover:bg-white/10 md:hidden"
          >
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-cream-50 transition-transform duration-500 ease-premium ${
                open ? "rotate-45" : "-translate-y-1.5"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-cream-50 transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              aria-hidden
              className={`absolute h-px w-5 bg-cream-50 transition-transform duration-500 ease-premium ${
                open ? "-rotate-45" : "translate-y-1.5"
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Menu móvel: painel translúcido */}
      <div
        id="menu-movel"
        ref={panelRef}
        inert={!open}
        className={`glass-dark fixed inset-x-4 top-[4.5rem] rounded-[28px] p-6 transition-[opacity,transform,visibility] duration-500 ease-premium md:hidden ${
          open
            ? "pointer-events-auto visible translate-y-0 opacity-100"
            : "pointer-events-none invisible -translate-y-3 opacity-0"
        }`}
      >
        <ul className="flex flex-col">
          {navLinks.map((link, i) => (
            <li
              key={link.id}
              className={`border-b border-white/10 transition-[opacity,transform] duration-700 ease-premium ${
                open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
            >
              <a
                href={`#${link.id}`}
                onClick={(e) => handleNav(e, link.id)}
                aria-current={active === link.id ? "location" : undefined}
                className="flex min-h-14 items-center justify-between font-display text-2xl font-light uppercase tracking-[0.08em] aria-[current=location]:text-sand-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <div
          className={`mt-6 transition-[opacity,transform] duration-700 ease-premium ${
            open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
          style={{ transitionDelay: open ? "420ms" : "0ms" }}
        >
          <Button href={whatsappLink(generalMessage)} className="w-full">
            {site.contactCta}
          </Button>
        </div>
      </div>
    </header>
  );
}
