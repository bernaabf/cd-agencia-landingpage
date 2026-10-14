import { DoubleSide, Group, Mesh, PlaneGeometry, ShaderMaterial } from "three";
import { quality, type QualityTier } from "@/lib/world/quality";
import type { TerrainModel } from "./Terrain";
import { worldTokens } from "@/lib/world/tokens";

export function createAtmosphere(terrain: TerrainModel, tier: QualityTier) {
  const { colors, noise } = terrain;
  const group = new Group();
  const skyGeometry = new PlaneGeometry(2, 2);
  const skyMaterial = new ShaderMaterial({
    depthTest: false, depthWrite: false,
    uniforms: { uZenith: { value: colors.background.clone() }, uHorizon: { value: colors.paper.clone() } },
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,1.,1.);}`,
    fragmentShader: `uniform vec3 uZenith,uHorizon; varying vec2 vUv;
      void main(){ vec3 color=mix(uHorizon,uZenith,smoothstep(.2,1.15,vUv.y));
      gl_FragColor=vec4(color,1.);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
  });
  const sky = new Mesh(skyGeometry, skyMaterial);
  sky.frustumCulled = false; sky.renderOrder = -1000; group.add(sky);
  const cloudGeometry = new PlaneGeometry(106, 166);
  const cloudMaterial = new ShaderMaterial({
    transparent: true, depthWrite: false, side: DoubleSide,
    uniforms: { uNoise: { value: noise }, uTime: { value: 0 }, uColor: { value: colors.paper.clone() } },
    vertexShader: `varying vec2 vUv; varying vec3 vWorld;
      void main(){vUv=uv;vWorld=(modelMatrix*vec4(position,1.)).xyz;gl_Position=projectionMatrix*viewMatrix*vec4(vWorld,1.);}`,
    fragmentShader: `uniform sampler2D uNoise; uniform float uTime; uniform vec3 uColor; varying vec2 vUv; varying vec3 vWorld;
      void main(){float n=texture2D(uNoise,vUv*2.+vec2(uTime,0.)).r;
      float edge=smoothstep(0.,.17,vUv.x)*(1.-smoothstep(.83,1.,vUv.x))*smoothstep(0.,.15,vUv.y)*(1.-smoothstep(.85,1.,vUv.y));
      float nearFade=smoothstep(1.5,10.,length(cameraPosition-vWorld));
      float alpha=smoothstep(.24,.61,n)*edge*nearFade*.15;
      gl_FragColor=vec4(uColor,alpha);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
  });
  for (let i = 0; i < quality[tier].clouds; i++) {
    const cloud = new Mesh(cloudGeometry, cloudMaterial);
    cloud.rotation.x = -Math.PI / 2; cloud.position.y = 3.4 + i * 2.3;
    group.add(cloud);
  }
  const fog = terrain.material.uniforms.uFog.value;
  const sun = terrain.material.uniforms.uSunColor.value;
  const direction = terrain.material.uniforms.uSunDirection.value;
  terrain.material.uniforms.uAtmosphere.value = 1;
  return {
    group,
    update(progress: number, time: number) {
      // A luz cruza as cristas; cor e direção mudam juntas ao longo da viagem.
      const golden = Math.sin(Math.min(1, progress) * Math.PI);
      const dusk = Math.max(0, (progress - 0.72) / 0.28);
      const dawn = Math.min(1, progress / 0.12);
      fog.copy(colors.sand).lerp(colors.paper, golden * 0.3).lerp(colors.deep, (1 - dawn) * 0.7 + dusk * 0.3);
      sun.copy(colors.paper).lerp(colors.sand, golden * 0.8).lerp(colors.rock, dusk * 0.35);
      direction.set(-0.75 + progress * 1.5, 0.23 + golden * 0.3, 0.45).normalize();
      terrain.material.uniforms.uProgress.value = progress;
      terrain.material.uniforms.uContours.value = 0.15 + Math.min(1, progress / 0.1) * 0.4;
      terrain.material.uniforms.uFogDensity.value = 0.005 + (1 - golden) * 0.006;
      terrain.material.uniforms.uTime.value = time * worldTokens.motion.fogSpeed;
      skyMaterial.uniforms.uZenith.value.copy(colors.background).lerp(colors.rock, golden * 0.36).lerp(colors.deep, dusk);
      skyMaterial.uniforms.uHorizon.value.copy(fog);
      cloudMaterial.uniforms.uColor.value.copy(fog);
      cloudMaterial.uniforms.uTime.value = time * worldTokens.motion.fogSpeed;
    },
    dispose() { skyGeometry.dispose(); skyMaterial.dispose(); cloudGeometry.dispose(); cloudMaterial.dispose(); },
  };
}
export type AtmosphereModel = ReturnType<typeof createAtmosphere>;
