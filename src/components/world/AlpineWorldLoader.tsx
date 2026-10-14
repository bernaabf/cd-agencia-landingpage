"use client";
import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { motion } from "@/lib/motion";
import { detectQuality, lowerTier, supportsWebGL2, type QualityTier } from "@/lib/world/quality";

const AlpineWorld = dynamic(() => import("./AlpineWorld"), { ssr: false });
class WorldBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function AlpineWorldLoader() {
  const [tier, setTier] = useState<QualityTier | null>(null);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState(false);
  const failure = useCallback(() => {
    document.documentElement.classList.remove("world-ready");
    setFailed(true);
  }, []);
  const downgrade = useCallback(() => {
    if (tier === "low") failure();
    else setTier(current => current ? lowerTier(current) : null);
  }, [failure, tier]);

  useEffect(() => {
    const media = matchMedia(motion.motionQuery);
    let disposed = false, inView = true, eligible = false, checked = false;
    let capability: QualityTier | null = null;
    const mount = () => {
      const active = !document.hidden && inView;
      setVisible(active);
      if (disposed || !eligible || !active) return;
      if (!media.matches) {
        document.documentElement.classList.remove("world-ready");
        setTier(null);
        return;
      }
      if (!checked) {
        checked = true;
        const selected = detectQuality();
        capability = selected && supportsWebGL2() ? selected : null;
      }
      setTier(current => current ?? capability);
    };
    const syncMotion = () => {
      if (!media.matches) { document.documentElement.classList.remove("world-ready"); setTier(null); }
      else mount();
    };
    const stage = document.getElementById("inicio");
    const observer = new IntersectionObserver(entries => {
      inView = entries[0]?.isIntersecting ?? false;
      mount();
    });
    if (stage) observer.observe(stage);
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", mount);
    // No dependency on the portrait: it is only revealed in the fourth act.
    const timer = setTimeout(() => { eligible = true; mount(); }, motion.world.loadDelay * 1000);
    return () => {
      disposed = true;
      clearTimeout(timer);
      observer.disconnect();
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", mount);
      document.documentElement.classList.remove("world-ready");
    };
  }, []);

  return tier && !failed ? (
    <WorldBoundary onFailure={failure}>
      <AlpineWorld tier={tier} active={visible} onFailure={failure} onDowngrade={downgrade} />
    </WorldBoundary>
  ) : null;
}
