/** Tokens de animação centralizados (GSAP). */
export const motion = {
  ease: {
    out: "expo.out",
    soft: "power3.out",
    none: "none",
  },
  duration: {
    fast: 0.6,
    base: 0.9,
    slow: 1.2,
  },
  stagger: {
    lines: 0.12,
    items: 0.1,
  },
  /** Ponto do viewport em que os elementos começam a ser revelados. */
  start: "top 88%",
  /** Sequência de entrada do Hero (em segundos). */
  hero: {
    image: 0,
    title: 0.45,
    text: 1.0,
    cta: 1.2,
    nav: 1.5,
  },
  world: {
    /** Briefly yield to the server-rendered title before loading WebGL. */
    loadDelay: 0.35,
    routeDuration: 3.2,
    driftPeriod: 48,
    fogSpeed: 0.002,
    scrollScrub: 0.8,
  },
  /** Parallax só em telas largas. */
  desktopQuery: "(min-width: 768px)",
  motionQuery: "(prefers-reduced-motion: no-preference)",
} as const;
