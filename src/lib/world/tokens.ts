import { motion } from "@/lib/motion";

/** Paleta espelhada dos tokens @theme, sem uma segunda fonte de hexadecimais. */
export const worldTokens = {
  colors: {
    background: "brown-900", deep: "brown-950", rock: "brown-700",
    sand: "sand-400", snow: "cream-100", paper: "cream-200",
  },
  motion: {
    loadDelay: motion.world.loadDelay,
    enter: motion.duration.slow,
    ease: motion.ease.soft,
    scrub: motion.world.scrollScrub,
    response: 5,
    driftPeriod: motion.world.driftPeriod,
    fogSpeed: motion.world.fogSpeed,
    markerPeriod: motion.duration.slow * 4,
  },
  terrain: { width: 112, depth: 176, snowLine: 23, contourInterval: 0.72 },
} as const;

export function readWorldColors() {
  const styles = getComputedStyle(document.documentElement);
  const colors = worldTokens.colors;
  return Object.fromEntries(Object.entries(colors).map(([key, token]) =>
    [key, styles.getPropertyValue(`--color-${token}`).trim()],
  )) as Record<keyof typeof colors, string>;
}
