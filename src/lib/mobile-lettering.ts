/** Editorial word entrances for touch. No scroll loop or line measurements. */
export function animateMobileLettering(headings: HTMLElement[]) {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    || !("IntersectionObserver" in window) || !("animate" in Element.prototype)) return () => {};

  const active = new Set<Animation>();
  const restores: (() => void)[] = [];
  const timings = {
    hero: { duration: 560, stagger: 35, cap: 140, delay: 40, rise: ".32em", opacity: .65 },
    section: { duration: 450, stagger: 22, cap: 100, delay: 0, rise: ".24em", opacity: .72 },
    detail: { duration: 340, stagger: 14, cap: 50, delay: 0, rise: ".16em", opacity: .85 },
  };

  const play = (heading: HTMLElement) => {
    if (document.hidden || connection?.saveData) return;
    // Only plain-text headings opt in. Keep React's original nodes for cleanup.
    const nodes = Array.from(heading.childNodes);
    if (!nodes.length || nodes.some(node => node.nodeType !== Node.TEXT_NODE)) return;
    const text = heading.textContent ?? "";
    const label = heading.getAttribute("aria-label");
    const restore = () => {
      heading.replaceChildren(...nodes);
      if (label === null) heading.removeAttribute("aria-label");
      else heading.setAttribute("aria-label", label);
    };
    const fragment = document.createDocumentFragment();
    const words: HTMLSpanElement[] = [];
    for (const part of text.split(/(\s+)/u)) {
      if (!part) continue;
      if (/^\s+$/u.test(part)) fragment.append(document.createTextNode(part));
      else {
        const word = document.createElement("span");
        word.className = "mobile-lettering-word";
        word.textContent = part;
        word.setAttribute("aria-hidden", "true");
        fragment.append(word);
        words.push(word);
      }
    }
    heading.setAttribute("aria-label", label ?? text);
    heading.replaceChildren(fragment);
    restores.push(restore);
    const kind = heading.dataset.mobileLettering as keyof typeof timings;
    const timing = timings[kind] ?? timings.section;
    try {
      words.forEach((word, index) => {
        const animation = word.animate([
          { transform: `translateY(${timing.rise})`, opacity: timing.opacity },
          { transform: "translateY(0)", opacity: 1 },
        ], {
          duration: timing.duration,
          delay: timing.delay + Math.min(index * timing.stagger, timing.cap),
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          fill: "backwards",
        });
        active.add(animation);
        animation.onfinish = () => { active.delete(animation); animation.cancel(); };
        animation.oncancel = () => { active.delete(animation); };
      });
    } catch {
      // Unsupported animation options must never leave broken or hidden text.
      for (const word of words) word.getAnimations().forEach(animation => animation.cancel());
      restore();
    }
  };

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      play(entry.target as HTMLElement);
    }
  }, { rootMargin: "0px 0px -8% 0px" });
  headings.forEach(heading => observer.observe(heading));

  const finishOnHidden = () => {
    if (document.hidden) active.forEach(animation => animation.cancel());
  };
  document.addEventListener("visibilitychange", finishOnHidden);
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", finishOnHidden);
    active.forEach(animation => animation.cancel());
    restores.forEach(restore => restore());
  };
}
