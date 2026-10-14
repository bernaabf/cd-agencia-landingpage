/** Client-only transient state; never drives a React render or imports Three.js. */
let progress = 0;
const listeners = new Set<() => void>();
export function getJourneyProgress() { return progress; }
export function setJourneyProgress(value: number) {
  progress = Math.max(0, Math.min(1, value));
  listeners.forEach(listener => listener());
}
export function subscribeJourney(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
