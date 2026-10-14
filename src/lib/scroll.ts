import type Lenis from "lenis";

let instance: Lenis | null = null;

export function registerLenis(lenis: Lenis | null) {
  instance = lenis;
}

export function getLenis() {
  return instance;
}

const NAV_OFFSET = 88;

/** Rola até uma seção usando Lenis quando ativo e o scroll nativo caso contrário. */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;

  if (instance) {
    // O scroll-margin-top das seções (globals.css) já compensa a navbar.
    instance.scrollTo(target, { duration: 1.4 });
  } else {
    const top = id === "inicio" ? 0 : target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top, behavior: "auto" });
  }

  if (window.location.hash !== `#${id}`) {
    window.history.pushState(null, "", id === "inicio" ? window.location.pathname : `#${id}`);
  }
}
