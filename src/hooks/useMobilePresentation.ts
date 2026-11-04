"use client";

import { useSyncExternalStore } from "react";
import { mobilePresentationQuery } from "@/lib/presentation";

function subscribe(notify: () => void) {
  const media = window.matchMedia(mobilePresentationQuery);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
}
const getSnapshot = () => window.matchMedia(mobilePresentationQuery).matches;
// Never initialize the desktop renderer until client capability has been resolved.
const getServerSnapshot = () => true;

export function useMobilePresentation() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
