"use client";

import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import AlpineWorldLoader from "./AlpineWorldLoader";
import { motion } from "@/lib/motion";
import { setJourneyProgress } from "@/lib/world/progress";
import { getLenis, scrollToSection } from "@/lib/scroll";

/** Desktop controller extracted without changing its authored journey. */
export default function DesktopHeroExperience({ stageRef }: { stageRef: RefObject<HTMLElement | null> }) {
  const ref = stageRef;
  useLayoutEffect(() => {
    const stage = ref.current;
    if (!stage) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();
    // GSAP reverts scroll triggers at breakpoints. Keep the reading section in place.
    let anchor: { element: HTMLElement; top: number } | undefined;
    let restoreFrame = 0;
    const rememberPosition = () => {
      anchor = undefined;
      const sections = document.querySelectorAll<HTMLElement>("main > section[id]");
      for (const element of sections) {
        const rect = element.getBoundingClientRect();
        if (element !== stage && rect.top <= innerHeight / 2 && rect.bottom > innerHeight / 2) {
          anchor = { element, top: rect.top };
          break;
        }
      }
      // CSS may already have lengthened the hero before matchMediaInit fires.
      // Header's observer still identifies the section being read in the old layout.
      if (!anchor) {
        const link = document.querySelector<HTMLAnchorElement>('header a[aria-current="location"]');
        const element = link?.hash && document.getElementById(link.hash.slice(1));
        if (element && element !== stage) anchor = { element, top: 88 };
      }
    };
    const restorePosition = () => {
      if (!anchor) return;
      const saved = anchor;
      cancelAnimationFrame(restoreFrame);
      restoreFrame = requestAnimationFrame(() => {
        const top = scrollY + saved.element.getBoundingClientRect().top - saved.top;
        const lenis = getLenis();
        if (lenis) lenis.scrollTo(top, { immediate: true });
        else window.scrollTo({ top, behavior: "instant" });
        ScrollTrigger.update();
      });
    };
    // GSAP 3.15 exposes these lifecycle events; its bundled declarations omit them.
    const mediaEvents = gsap as typeof gsap & {
      addEventListener: (event: "matchMediaInit" | "matchMedia", listener: () => void) => void;
      removeEventListener: (event: "matchMediaInit" | "matchMedia", listener: () => void) => void;
    };
    mediaEvents.addEventListener("matchMediaInit", rememberPosition);
    mediaEvents.addEventListener("matchMedia", restorePosition);
    mm.add({ motion: motion.motionQuery, mobile: "(max-width: 767px)" }, (context) => {
      if (!context.conditions?.motion) return;
      const mobile = context.conditions.mobile;
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
          scrub: mobile ? 0.35 : motion.world.scrollScrub, invalidateOnRefresh: true,
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
    return () => {
      mediaEvents.removeEventListener("matchMediaInit", rememberPosition);
      mediaEvents.removeEventListener("matchMedia", restorePosition);
      cancelAnimationFrame(restoreFrame);
      mm.revert();
    };
  }, [ref]);

  return (
    <>
        <AlpineWorldLoader />
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
    </>
  );
}
