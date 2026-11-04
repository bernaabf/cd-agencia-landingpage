"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** The existing contact action stays reachable without covering inline CTAs. */
export default function MobileContact({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const visible = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      if (ref.current) ref.current.hidden = visible.size > 0;
    });
    document.querySelectorAll("[data-contact-action], #contato").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className="mobile-contact">{children}</div>;
}
