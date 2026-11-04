"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { useMobilePresentation } from "@/hooks/useMobilePresentation";

import DesktopHeroExperience from "./DesktopHeroExperience";

/** One semantic hero; the desktop runtime is never mounted on mobile. */
export default function HeroStage({ children, mobileScene }: { children: ReactNode; mobileScene: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const mobile = useMobilePresentation();
  const previousMode = useRef(mobile);
  useLayoutEffect(() => {
    if (previousMode.current === mobile) return;
    previousMode.current = mobile;
    // Retain the reading section when rotation mounts/unmounts the desktop controller.
    const active = document.querySelector<HTMLAnchorElement>('header a[aria-current="location"]');
    const target = active?.hash && document.getElementById(active.hash.slice(1));
    if (!target || target === ref.current) return;
    const frame = requestAnimationFrame(() => {
      const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 88;
      window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - offset, behavior: "instant" });
    });
    return () => cancelAnimationFrame(frame);
  }, [mobile]);

  return <section ref={ref} id="inicio" aria-labelledby="hero-title" className="hero-stage"
    data-presentation={mobile ? "mobile" : "desktop"}>
    <div className="hero-stage-viewport">
      {mobileScene}
      <div className="hero-stage-scrim" aria-hidden="true" />
      {children}
      {!mobile && <DesktopHeroExperience stageRef={ref} />}
    </div>
  </section>;
}
