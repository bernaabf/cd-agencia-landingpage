"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import { motion } from "@/lib/motion";
import { registerLenis } from "@/lib/scroll";

/**
 * Orquestra todas as animações do site a partir de atributos data-*:
 *  data-split      títulos revelados por linha com máscara
 *  data-reveal     fade + deslocamento vertical ao entrar no viewport
 *  data-mask       imagem revelada por máscara (clip-path)
 *  data-reveal-scale  zoom suave de entrada da imagem
 *  data-parallax   parallax sutil (somente telas largas)
 *  data-nav        entrada da navegação (HeroStage controla o hero)
 *
 * Tudo é revertido na desmontagem (matchMedia.revert + destroy do Lenis).
 */
export default function MotionRoot() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const root = document.documentElement;
    const mm = gsap.matchMedia();

    mm.add(
      { motion: motion.motionQuery, desktop: motion.desktopQuery },
      (context) => {
        const { motion: allowed, desktop } = context.conditions as {
          motion: boolean;
          desktop: boolean;
        };
        if (!allowed) return;

        /* ---------- Smooth scroll (Lenis) integrado ao ScrollTrigger ---------- */
        const lenis = new Lenis({ lerp: 0.09 });
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        registerLenis(lenis);

        const splits: SplitText[] = [];
        const q = <T extends Element = HTMLElement>(sel: string) =>
          gsap.utils.toArray<T>(sel);

        /* ---------- Títulos: split por linhas + máscara ---------- */
        q("[data-split]").forEach((el) => {
          const isHero = el.hasAttribute("data-hero");
          const split = SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            linesClass: "split-line",
            maskClass: "split-mask",
            onSplit(self) {
              gsap.set(el, { visibility: "visible" });
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: motion.duration.slow,
                ease: motion.ease.out,
                stagger: motion.stagger.lines,
                delay: isHero ? motion.hero.title : 0,
                scrollTrigger: isHero
                  ? undefined
                  : { trigger: el, start: motion.start, once: true },
              });
            },
          });
          splits.push(split);
        });

        /* ---------- Navegação; o palco tem sua própria timeline ---------- */
        gsap.to("[data-nav]", {
          opacity: 1, y: 0, duration: motion.duration.base,
          delay: motion.hero.nav, ease: motion.ease.out,
        });

        /* ---------- Imagens: máscara + zoom de entrada ---------- */
        q("[data-mask]").forEach((el) => {
          const isHero = el.hasAttribute("data-hero");
          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0% round 24px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 24px)",
              duration: motion.duration.slow + 0.2,
              ease: motion.ease.out,
              delay: isHero ? motion.hero.image : 0,
              scrollTrigger: isHero ? undefined : { trigger: el, start: "top 90%", once: true },
            },
          );
          const inner = el.querySelector("[data-reveal-scale]");
          if (inner) {
            gsap.fromTo(
              inner,
              { scale: 1.18 },
              {
                scale: 1,
                duration: 1.8,
                ease: motion.ease.out,
                delay: isHero ? motion.hero.image : 0,
                scrollTrigger: isHero ? undefined : { trigger: el, start: "top 90%", once: true },
              },
            );
          }
        });

        /* ---------- Reveals em lote (cards, textos, ícones) ---------- */
        ScrollTrigger.batch("[data-reveal]", {
          start: motion.start,
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: motion.duration.base,
              ease: motion.ease.out,
              stagger: motion.stagger.items,
              overwrite: true,
            }),
        });

        /* ---------- Parallax sutil (telas largas) ---------- */
        if (desktop) {
          q("[data-parallax]").forEach((el) => {
            const amount = Number(el.getAttribute("data-parallax")) || 6;
            gsap.fromTo(
              el,
              { yPercent: -amount },
              {
                yPercent: amount,
                ease: motion.ease.none,
                scrollTrigger: {
                  trigger: el.parentElement ?? el,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
          });
        }

        root.classList.add("motion-ready");

        return () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          registerLenis(null);
          splits.forEach((s) => s.revert());
          root.classList.remove("motion-ready");
        };
      },
    );

    return () => mm.revert();
  }, []);

  return null;
}
