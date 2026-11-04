"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Keep the thumb action only where the bottom strip is free of page content. */
export default function MobileContact({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let observer: IntersectionObserver;
    const observe = () => {
      observer?.disconnect();
      const visible = new Set<Element>();
      observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visible.add(entry.target);
          else visible.delete(entry.target);
        });
        if (ref.current) ref.current.hidden = visible.size > 0;
      }, { rootMargin: `-${Math.max(0, innerHeight - 112)}px 0px 0px 0px` });
      document.querySelectorAll(
        "main p, main h1, main h2, main h3, main figure, [data-mask], [data-contact-action], main footer, main [role='group']",
      ).forEach(el => observer.observe(el));
    };
    observe();
    window.addEventListener("resize", observe, { passive: true });
    return () => { observer.disconnect(); window.removeEventListener("resize", observe); };
  }, []);
  return <div ref={ref} className="mobile-contact">{children}</div>;
}
