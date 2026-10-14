export type QualityTier = "high" | "medium" | "low";
export const quality = {
  high: { segments: 224, maxDpr: 1.5, clouds: 4, fogSteps: 6 },
  medium: { segments: 144, maxDpr: 1.35, clouds: 3, fogSteps: 0 },
  low: { segments: 80, maxDpr: 1.25, clouds: 0, fogSteps: 0 },
} as const;

export function detectQuality(): QualityTier | null {
  const device = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const cores = device.hardwareConcurrency || 4;
  const memory = device.deviceMemory ?? 8;
  if (cores <= 2 || memory <= 2 || device.connection?.saveData) return null;
  if (innerWidth < 768 || memory < 4 || cores < 4) return "low";
  if (innerWidth < 1200 || cores < 8 || memory < 8) return "medium";
  return "high";
}

export function lowerTier(tier: QualityTier): QualityTier | null {
  return tier === "high" ? "medium" : tier === "medium" ? "low" : null;
}

export function supportsWebGL2() {
  try {
    const context = document.createElement("canvas").getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!context) return false;
    context.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch { return false; }
}
