/** Short, one-shot entrances. No scroll handler, ticker, refresh or layout mutation. */
export function revealOnMobile(elements: HTMLElement[]) {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData || !('IntersectionObserver' in window)) return () => {};
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove("mobile-reveal-pending");
      observer.unobserve(entry.target);
    }
  }, { rootMargin: "0px 0px -6% 0px" });
  const pending = elements.filter(element => element.getBoundingClientRect().top >= innerHeight);
  for (const element of pending) {
    element.classList.add("mobile-reveal", "mobile-reveal-pending");
    observer.observe(element);
  }
  return () => {
    observer.disconnect();
    pending.forEach(element => element.classList.remove("mobile-reveal", "mobile-reveal-pending"));
  };
}
