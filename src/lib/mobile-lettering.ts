/** One-shot editorial masks for touch, without line measurements or a scroll loop. */
export function animateMobileLettering(headings: HTMLElement[]) {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches
    || !("IntersectionObserver" in window) || !("animate" in Element.prototype)) return () => {};

  const active = new Set<Animation>();
  const restores = new Set<() => void>();
  const timings = {
    hero: { duration: 620, stagger: 45, cap: 180, delay: 40, rise: "105%", opacity: 0 },
    section: { duration: 460, stagger: 28, cap: 112, delay: 0, rise: "80%", opacity: .08 },
    detail: { duration: 340, stagger: 22, cap: 44, delay: 0, rise: "55%", opacity: .2 },
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
      restores.delete(restore);
    };
    const fragment = document.createDocumentFragment();
    const words: HTMLSpanElement[] = [];
    for (const part of text.split(/(\s+)/u)) {
      if (!part) continue;
      if (/^\s+$/u.test(part)) fragment.append(document.createTextNode(part));
      else {
        const word = document.createElement("span");
        const mask = document.createElement("span");
        mask.className = "mobile-lettering-mask";
        mask.setAttribute("aria-hidden", "true");
        word.className = "mobile-lettering-word";
        word.textContent = part;
        mask.append(word);
        fragment.append(mask);
        words.push(word);
      }
    }
    heading.setAttribute("aria-label", label ?? text);
    heading.replaceChildren(fragment);
    restores.add(restore);
    const kind = heading.dataset.mobileLettering as keyof typeof timings;
    const timing = timings[kind] ?? timings.section;
    let remaining = words.length;
    if (!remaining) { restore(); return; }
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
        animation.onfinish = () => {
          active.delete(animation);
          animation.cancel();
          if (--remaining === 0) restore();
        };
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
  }, { rootMargin: "0px 0px -12% 0px" });
  headings.forEach(heading => observer.observe(heading));

  const finishOnHidden = () => {
    if (document.hidden) {
      active.forEach(animation => animation.cancel());
      restores.forEach(restore => restore());
    }
  };
  document.addEventListener("visibilitychange", finishOnHidden);
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", finishOnHidden);
    active.forEach(animation => animation.cancel());
    restores.forEach(restore => restore());
  };
}
