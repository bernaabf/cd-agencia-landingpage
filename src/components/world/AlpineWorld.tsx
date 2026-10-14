"use client";
import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import gsap from "gsap";
import { quality, type QualityTier } from "@/lib/world/quality";
import { worldTokens } from "@/lib/world/tokens";
import { type TerrainData } from "@/lib/world/terrain";
import { createTerrain, type TerrainModel } from "./Terrain";
import { createAtmosphere, type AtmosphereModel } from "./Atmosphere";
import { createCameraRig, type CameraRigModel } from "./CameraRig";
import { createRoute, type RouteModel } from "./Route";
import { createDepthLayers, type DepthLayersModel } from "./DepthLayers";
import { createGpuTimer } from "@/lib/world/performance";
import { motion } from "@/lib/motion";

type WorldProps = { tier: QualityTier; active: boolean; onFailure: () => void; onDowngrade: () => void };
function prepareRenderer({ gl }: RootState) {
  const lose = gl.forceContextLoss.bind(gl);
  gl.forceContextLoss = () => { if (!gl.getContext().isContextLost()) lose(); };
}
function WorldScene({ tier, active, onFailure, onDowngrade }: WorldProps) {
  const get = useThree(state => state.get);
  const invalidate = useThree(state => state.invalidate);
  const entrance = useRef({ opacity: 0 });
  const runtime = useRef<{
    terrain: TerrainModel; atmosphere: AtmosphereModel; rig: CameraRigModel; route: RouteModel;
    gpu: ReturnType<typeof createGpuTimer>; wrapper: HTMLElement | null;
    time: number; opacity: number; reportedProgress: number; ready: boolean; frames: number; cost: number; start: number; last: number;
    benchmarked: boolean; slowWindows: number;
  } | null>(null);
  useEffect(() => {
    const { scene, camera, gl } = get();
    const entry = entrance.current;
    const worker = new Worker(new URL("../../lib/world/terrain.worker.ts", import.meta.url), { type: "module" });
    let model: TerrainModel | undefined;
    let atmosphere: AtmosphereModel | undefined;
    let rig: CameraRigModel | undefined;
    let route: RouteModel | undefined;
    let depth: DepthLayersModel | undefined;
    let disposed = false;
    const mm = gsap.matchMedia();
    mm.add(motion.motionQuery, () => {
      gsap.to(entry, { opacity: 1, duration: worldTokens.motion.enter,
        ease: worldTokens.motion.ease, paused: true, id: "alpine-world-enter" });
    });
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    const shaderError = gl.debug.onShaderError;
    gl.debug.onShaderError = onFailure;
    worker.onerror = onFailure;
    worker.onmessage = ({ data }: MessageEvent<TerrainData>) => {
      if (disposed) return;
      worker.terminate();
      try {
        model = createTerrain(data, tier);
        if (!(camera instanceof PerspectiveCamera)) { onFailure(); return; }
        scene.add(model.mesh);
        atmosphere = createAtmosphere(model, tier); scene.add(atmosphere.group);
        scene.background = model.colors.background.clone();
        rig = createCameraRig(camera, data, invalidate);
        route = createRoute(data, model, tier); scene.add(route.group);
        depth = createDepthLayers(data, model, tier); scene.add(depth.group);
        const now = performance.now();
        runtime.current = { terrain: model, atmosphere, rig, route, gpu: createGpuTimer(gl.getContext() as WebGL2RenderingContext),
          wrapper: gl.domElement.closest<HTMLElement>(".alpine-world"), time: 0, opacity: -1, reportedProgress: -1, ready: false,
          frames: 0, cost: 0, start: now + 500, last: now, benchmarked: false, slowWindows: 0 };
        invalidate();
      } catch { onFailure(); }
    };
    worker.postMessage({ segments: quality[tier].segments });
    return () => {
      disposed = true;
      worker.terminate(); runtime.current?.gpu.dispose(); runtime.current = null;
      mm.revert(); entry.opacity = 0;
      rig?.dispose();
      gl.domElement.removeEventListener("webglcontextlost", lost); gl.debug.onShaderError = shaderError;
      if (model) { scene.remove(model.mesh); model.dispose(); }
      if (atmosphere) { scene.remove(atmosphere.group); atmosphere.dispose(); }
      if (route) { scene.remove(route.group); route.dispose(); }
      if (depth) { scene.remove(depth.group); depth.dispose(); }
      scene.background = null;
      document.documentElement.classList.remove("world-ready");
    };
  }, [get, invalidate, onFailure, tier]);
  useEffect(() => { if (active) invalidate(); }, [active, invalidate]);
  useFrame(({ gl, scene, camera }, delta) => {
    const current = runtime.current;
    if (!current || !active) return;
    const start = performance.now();
    if (start - current.last > 250) { current.start = start; current.frames = current.cost = 0; }
    current.last = start;
    current.time += Math.min(delta, 0.05);
    const progress = current.rig.update();
    current.atmosphere.update(progress, current.time);
    current.route.update(progress, current.time);
    try {
      current.gpu.begin(); gl.render(scene, camera); current.gpu.end();
      if (!current.ready) {
        current.ready = true; gl.domElement.setAttribute("data-world-ready", "true");
        gl.domElement.setAttribute("data-world-tier", tier);
        document.documentElement.classList.add("world-ready");
        gsap.getById("alpine-world-enter")?.play();
      }
      const fade = Math.max(0, Math.min(1, (progress - 0.87) / 0.11));
      const opacity = entrance.current.opacity * (1 - fade * fade * (3 - 2 * fade));
      if (current.wrapper && opacity !== current.opacity) { current.wrapper.style.opacity = String(opacity); current.opacity = opacity; }
      if (start >= current.start) { current.cost += performance.now() - start; current.frames++; }
      if (start - current.start >= 1000) {
        const fps = current.frames * 1000 / (start - current.start), renderMs = current.cost / current.frames;
        const gpuMs = current.gpu.milliseconds;
        const { viewport, setDpr } = get();
        const slow = fps < 48 || renderMs > 12 || (gpuMs !== null && gpuMs > 13);
        gl.domElement.setAttribute("data-world-metrics", JSON.stringify({ fps, renderMs, gpuMs, dpr: viewport.dpr, tier }));
        gl.domElement.setAttribute("data-world-progress", progress.toFixed(4));
        if (!current.benchmarked) {
          gl.domElement.setAttribute("data-world-benchmark", JSON.stringify({ fps, renderMs, gpuMs, dpr: viewport.dpr }));
          current.benchmarked = true;
        }
        current.slowWindows = slow ? current.slowWindows + 1 : 0;
        if (slow && viewport.dpr > 1.01) { setDpr(Math.max(1, viewport.dpr * 0.8)); current.slowWindows = 0; }
        else if (current.slowWindows >= 2) { onDowngrade(); current.slowWindows = 0; }
        current.start = start; current.frames = current.cost = 0;
      }
      // Mobile fica estático em repouso. Nos outros tiers, apenas névoa e luz respiram.
      const moving = current.rig.moving();
      const rounded = Math.round(progress * 10000);
      if (!moving && rounded !== current.reportedProgress) {
        gl.domElement.setAttribute("data-world-progress", progress.toFixed(4)); current.reportedProgress = rounded;
      }
      if (current.time < worldTokens.motion.enter || moving
        || (tier !== "low" && fade < 1)) invalidate();
    } catch { onFailure(); }
  }, 1);
  return null;
}
export default function AlpineWorld(props: WorldProps) {
  return <div className="alpine-world" aria-hidden="true">
    <Canvas aria-hidden="true" tabIndex={-1} frameloop="demand" dpr={[1, quality[props.tier].maxDpr]}
      camera={{ fov: 48, near: 0.2, far: 260 }}
      gl={{ alpha: false, antialias: true, powerPreference: "low-power", failIfMajorPerformanceCaveat: true }}
      onCreated={prepareRenderer} fallback={null}>
      <WorldScene {...props} />
    </Canvas>
  </div>;
}
