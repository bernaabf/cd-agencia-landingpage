"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "@/lib/motion";
import { mobilePresentationQuery } from "@/lib/presentation";
import { revealOnMobile } from "@/lib/mobile-reveals";
import { animateMobileLettering } from "@/lib/mobile-lettering";
import { registerLenis } from "@/lib/scroll";

/** Desktop keeps the authored masks; touch uses native scroll and lighter reveals. */
export default function MotionRoot() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = document.documentElement;
    const mm = gsap.matchMedia();
    let disposed = false;
    let refreshFrame = 0;
    const refresh = () => {
      cancelAnimationFrame(refreshFrame);
      refreshFrame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh(); });
    };

    mm.add({ motion: motion.motionQuery, desktop: motion.desktopQuery, mobile: mobilePresentationQuery,
      smooth: "(min-width: 768px) and (hover: hover) and (pointer: fine)" }, context => {
      const { motion: allowed, desktop, smooth, mobile } = context.conditions!;
      if (mobile) {
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
        root.classList.toggle("mobile-static-motion", !allowed || Boolean(connection?.saveData));
        // A title owns its entrance; do not also animate its surrounding row.
        const revealTargets = gsap.utils.toArray<HTMLElement>("[data-split], [data-mask], [data-reveal]")
          .filter(el => !el.matches("[data-mobile-lettering]") && !el.querySelector("[data-mobile-lettering]"));
        const cleanup = allowed ? revealOnMobile(revealTargets) : () => {};
        const cleanupLettering = allowed
          ? animateMobileLettering(gsap.utils.toArray<HTMLElement>("[data-mobile-lettering]")) : () => {};
        root.classList.add("motion-ready");
        return () => { cleanup(); cleanupLettering(); root.classList.remove("motion-ready", "mobile-static-motion"); };
      }
      if (!allowed) return;
      let resourcesActive = true;
      const imageLoaded = (event: Event) => { if (event.target instanceof HTMLImageElement) refresh(); };
      document.addEventListener("load", imageLoaded, true);
      void document.fonts.ready.then(() => { if (resourcesActive) refresh(); });
      let cancelled = false;
      let stopSmooth: (() => void) | undefined;
      let revertSplits: (() => void) | undefined;
      const q = (selector: string) => gsap.utils.toArray<HTMLElement>(selector);

      if (smooth) {
        // Do not download Lenis or run its ticker for native touch scrolling.
        context.add("startSmooth", (Lenis: typeof import("lenis").default) => {
          const lenis = new Lenis({ lerp: 0.09, syncTouch: false });
          lenis.on("scroll", ScrollTrigger.update);
          const tick = (time: number) => lenis.raf(time * 1000);
          gsap.ticker.add(tick);
          registerLenis(lenis);
          stopSmooth = () => { gsap.ticker.remove(tick); lenis.destroy(); registerLenis(null); };
        });
        void import("lenis").then(({ default: Lenis }) => { if (!cancelled) context.startSmooth(Lenis); });
      }

      if (desktop) {
        context.add("splitTitles", (SplitText: typeof import("gsap/SplitText").SplitText) => {
          gsap.registerPlugin(SplitText);
          const splits = q("[data-split]").map(el => SplitText.create(el, {
            type: "lines", mask: "lines", autoSplit: true,
            linesClass: "split-line", maskClass: "split-mask",
            onSplit(self) {
              return gsap.from(self.lines, { yPercent: 110, duration: motion.duration.slow,
                ease: motion.ease.out, stagger: motion.stagger.lines,
                scrollTrigger: { trigger: el, start: motion.start, once: true } });
            },
          }));
          revertSplits = () => splits.forEach(split => split.revert());
          refresh();
        });
        void import("gsap/SplitText").then(({ SplitText }) => { if (!cancelled) context.splitTitles(SplitText); });
      } else {
        q("[data-split]").forEach(el => gsap.from(el, { opacity: 0, y: 16, duration: 0.55,
          ease: motion.ease.soft, scrollTrigger: { trigger: el, start: motion.start, once: true } }));
      }

      gsap.to("[data-nav]", { opacity: 1, y: 0, duration: desktop ? motion.duration.base : 0.45,
        delay: desktop ? motion.hero.nav : 0, ease: motion.ease.out });

      q("[data-mask]").forEach(el => {
        gsap.fromTo(el, desktop ? { clipPath: "inset(100% 0% 0% 0% round 24px)" } : { opacity: 0, y: 16 }, {
          ...(desktop ? { clipPath: "inset(0% 0% 0% 0% round 24px)" } : { opacity: 1, y: 0 }),
          duration: desktop ? motion.duration.slow + 0.2 : 0.55, ease: motion.ease.out,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        });
        const inner = el.querySelector("[data-reveal-scale]");
        if (inner && desktop) gsap.fromTo(inner, { scale: 1.18 }, { scale: 1, duration: 1.8,
          ease: motion.ease.out, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      });

      if (desktop) {
        gsap.set("[data-reveal]", { opacity: 0, y: 28 });
        ScrollTrigger.batch("[data-reveal]", {
          start: motion.start, once: true,
          onEnter: batch => gsap.to(batch, { opacity: 1, y: 0,
            duration: motion.duration.base, ease: motion.ease.out,
            stagger: motion.stagger.items, overwrite: true }),
        });
      } else {
        q("[data-reveal]").forEach(el => gsap.from(el, { opacity: 0, y: 16,
          duration: 0.5, ease: motion.ease.out,
          scrollTrigger: { trigger: el, start: motion.start, once: true } }));
      }

      if (desktop) q("[data-parallax]").forEach(el => {
        const amount = Number(el.dataset.parallax) || 6;
        gsap.fromTo(el, { yPercent: -amount }, { yPercent: amount, ease: motion.ease.none,
          scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true } });
      });
      root.classList.add("motion-ready");
      return () => {
        cancelled = true;
        resourcesActive = false;
        document.removeEventListener("load", imageLoaded, true);
        stopSmooth?.();
        revertSplits?.();
        root.classList.remove("motion-ready");
      };
    });
    return () => {
      disposed = true;
      cancelAnimationFrame(refreshFrame);
      mm.revert();
    };
  }, []);
  return null;
}
