"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import AlpineWorldLoader from "./AlpineWorldLoader";
import { motion } from "@/lib/motion";
import { setJourneyProgress } from "@/lib/world/progress";
import { getLenis, scrollToSection } from "@/lib/scroll";

/** Native sticky owns layout; one scrubbed timeline owns every narrative layer. */
export default function HeroStage({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    mm.add(motion.motionQuery, () => {
      stage.dataset.immersive = "true";
      const distance = () => stage.offsetHeight - (stage.firstElementChild as HTMLElement).offsetHeight;
      const select = gsap.utils.selector(stage);
      const opening = select("[data-stage-opening]");
      const story = select("[data-stage-story]");
      const invitation = select("[data-stage-invitation]");
      const guide = select("[data-stage-guide]");
      const progress = { value: 0 };
      gsap.set([story, invitation, guide], { opacity: 0, y: 20, pointerEvents: "none" });
      gsap.fromTo(select(".hero-eyebrow"), { opacity: 0 }, { opacity: 1, duration: 0.8 });
      gsap.fromTo(select("[data-stage-title]"), { yPercent: 115 },
        { yPercent: 0, duration: 1.4, delay: 0.2, ease: "power3.out" });
      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          id: "hero-stage", trigger: stage, start: "top top", end: () => `+=${distance()}`,
          scrub: motion.world.scrollScrub, invalidateOnRefresh: true,
        },
      });
      timeline.to(progress, { value: 1, duration: 1,
        onUpdate: () => {
          setJourneyProgress(progress.value);
          stage.style.setProperty("--journey-progress", String(progress.value));
        },
      }, 0)
        .to(opening, { opacity: 0, y: -32, scale: 0.98, duration: 0.08, ease: "power2.inOut" }, 0.16)
        .to(story, { opacity: 1, y: 0, duration: 0.07, ease: "power2.inOut" }, 0.21)
        .to(story, { opacity: 0, y: -20, duration: 0.06, ease: "power2.inOut" }, 0.47)
        .set(invitation, { pointerEvents: "auto" }, 0.53)
        .to(invitation, { opacity: 1, y: 0, duration: 0.07, ease: "power2.inOut" }, 0.53)
        .to(invitation, { opacity: 0, y: -20, duration: 0.05, ease: "power2.inOut" }, 0.73)
        .set(invitation, { pointerEvents: "none" }, 0.78)
        .to(guide, { opacity: 1, y: 0, duration: 0.07, ease: "power2.inOut" }, 0.78)
        .fromTo(select("[data-stage-portrait]"), { scale: 1.04 },
          { scale: 1, duration: 0.12, ease: "power2.out" }, 0.78)
        .to(guide, { opacity: 0, y: -16, duration: 0.05 }, 0.93)
        .to(select(".hero-stage-shade"), { opacity: 1, duration: 0.05 }, 0.95)
        .to(select(".hero-stage-controls"), { opacity: 0, duration: 0.05 }, 0.95);

      // Focus seeks the CTA's act; opacity never removes copy from the reading order.
      const focus = (event: FocusEvent) => {
        if (!(event.target instanceof Element) || !event.target.closest("[data-stage-invitation]")) return;
        const y = stage.getBoundingClientRect().top + scrollY + distance() * 0.65;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(y, { immediate: true });
        else window.scrollTo({ top: y, behavior: "instant" });
        ScrollTrigger.update();
        timeline.scrollTrigger?.getTween()?.progress(1);
        timeline.progress(0.65);
      };
      stage.addEventListener("focusin", focus);
      ScrollTrigger.refresh();
      return () => {
        stage.removeEventListener("focusin", focus);
        delete stage.dataset.immersive;
        stage.style.removeProperty("--journey-progress");
        setJourneyProgress(0);
      };
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={ref} id="inicio" aria-labelledby="hero-title" className="hero-stage">
      <div className="hero-stage-viewport">
        <AlpineWorldLoader />
        <div className="hero-stage-scrim" aria-hidden="true" />
        {children}
        <div className="hero-stage-shade" aria-hidden="true" />
        <div className="hero-stage-controls">
          <button type="button" className="hero-scroll-cue" aria-label="Explore pela rolagem: avançar pela experiência nos Alpes"
            onClick={() => {
              const stage = ref.current;
              if (!stage) return;
              const start = stage.getBoundingClientRect().top + scrollY;
              const distance = stage.offsetHeight - (stage.firstElementChild as HTMLElement).offsetHeight;
              const p = (scrollY - start) / distance;
              const next = [0.36, 0.65, 0.88, 1.02].find(value => value > p + 0.03) ?? 1.02;
              const target = start + distance * next;
              const lenis = getLenis();
              if (lenis) lenis.scrollTo(target, { duration: 2.2 });
              else window.scrollTo({ top: target, behavior: "smooth" });
            }}><ArrowDown size={16} aria-hidden="true" /><span>Explore pela rolagem</span></button>
          <div className="hero-progress" aria-hidden="true"><span /></div>
          <a href="#sobre" onClick={event => {
            event.preventDefault();
            scrollToSection("sobre");
            document.getElementById("sobre")?.focus({ preventScroll: true });
          }}>Pular apresentação</a>
        </div>
      </div>
    </section>
  );
}
