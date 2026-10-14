import { BufferAttribute, BufferGeometry, Color, DataTexture, LinearFilter, Mesh,
  RepeatWrapping, RGBAFormat, ShaderMaterial, Vector3 } from "three";
import { quality, type QualityTier } from "@/lib/world/quality";
import { readWorldColors, worldTokens } from "@/lib/world/tokens";
import { type TerrainData } from "@/lib/world/terrain";
import { terrainVertex, terrainFragment } from "@/lib/world/shaders/terrain.glsl";

export function createTerrain(data: TerrainData, tier: QualityTier) {
  const palette = readWorldColors();
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(data.positions, 3));
  geometry.setAttribute("normal", new BufferAttribute(data.normals, 3));
  geometry.setAttribute("cavity", new BufferAttribute(data.cavity, 1));
  geometry.setAttribute("terrainShadow", new BufferAttribute(data.shadows, 3));
  geometry.setIndex(new BufferAttribute(data.indices, 1));
  geometry.computeBoundingSphere();
  const noise = new DataTexture(data.noise, 128, 128, RGBAFormat);
  noise.wrapS = noise.wrapT = RepeatWrapping;
  noise.magFilter = noise.minFilter = LinearFilter;
  noise.needsUpdate = true;
  const colors = {
    deep: new Color(palette.deep), rock: new Color(palette.rock), sand: new Color(palette.sand),
    snow: new Color(palette.snow), paper: new Color(palette.paper), background: new Color(palette.background),
  };
  const material = new ShaderMaterial({
    vertexShader: terrainVertex, fragmentShader: terrainFragment,
    defines: { FOG_STEPS: quality[tier].fogSteps },
    uniforms: {
      uDeep: { value: colors.deep }, uRock: { value: colors.rock }, uSand: { value: colors.sand },
      uSnow: { value: colors.snow }, uFog: { value: colors.paper.clone() },
      uSunColor: { value: colors.paper.clone() }, uSunDirection: { value: new Vector3(-0.6, 0.35, 0.5) },
      uNoise: { value: noise }, uTime: { value: 0 }, uAtmosphere: { value: 0 },
      uProgress: { value: 0 }, uContours: { value: 0.5 }, uSnowLine: { value: worldTokens.terrain.snowLine }, uFogDensity: { value: 0.012 },
      uContourInterval: { value: worldTokens.terrain.contourInterval },
    },
  });
  const mesh = new Mesh(geometry, material);
  return { mesh, material, noise, colors, dispose() { geometry.dispose(); material.dispose(); noise.dispose(); } };
}
export type TerrainModel = ReturnType<typeof createTerrain>;
