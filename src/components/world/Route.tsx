import { CatmullRomCurve3, Curve, Group, InstancedBufferAttribute, InstancedMesh, Matrix4,
  Mesh, ShaderMaterial, SphereGeometry, TubeGeometry, Vector3 } from "three";
import { sampleHeight, type TerrainData, valleyCenter } from "@/lib/world/terrain";
import type { QualityTier } from "@/lib/world/quality";
import type { TerrainModel } from "./Terrain";
import { worldTokens } from "@/lib/world/tokens";

class SurfaceCurve extends Curve<Vector3> {
  private readonly path: CatmullRomCurve3;
  constructor(private readonly data: TerrainData) {
    super();
    this.path = new CatmullRomCurve3([
      ...[22, 8, -7, -22, -35, -42].map(z => new Vector3(valleyCenter(z), 0, z)),
      new Vector3(-9, 0, -44), new Vector3(-19, 0, -48),
    ], false, "centripetal");
  }
  getPoint(t: number, target = new Vector3()) {
    this.path.getPoint(t, target);
    target.y = sampleHeight(this.data, target.x, target.z) + 0.32;
    return target;
  }
  getPointAt(t: number, target = new Vector3()) { return this.getPoint(t, target); }
  getTangentAt(t: number, target = new Vector3()) { return this.getTangent(t, target); }
}

export function createRoute(data: TerrainData, terrain: TerrainModel, tier: QualityTier) {
  const curve = new SurfaceCurve(data), group = new Group();
  const geometry = new TubeGeometry(curve, tier === "low" ? 384 : 896, 0.13, 5, false);
  const fog = terrain.material.uniforms.uFog;
  const material = new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uColor: { value: terrain.colors.snow }, uFog: fog, uProgress: { value: 0 } },
    vertexShader: `varying float vAlong; varying vec3 vWorld;
      void main(){vAlong=uv.x;vWorld=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `uniform vec3 uColor,uFog; uniform float uProgress; varying float vAlong; varying vec3 vWorld;
      void main(){float alpha=1.-smoothstep(uProgress-.008,uProgress,vAlong);if(alpha<.01)discard;
      vec3 color=mix(uColor*1.5,uFog,1.-exp(-length(cameraPosition-vWorld)*.007));
      gl_FragColor=vec4(color,alpha*.95);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
  });
  group.add(new Mesh(geometry, material));
  const stops = [0.27, 0.48, 0.68, 1];
  const markerGeometry = new SphereGeometry(0.25, 10, 8);
  markerGeometry.setAttribute("stop", new InstancedBufferAttribute(new Float32Array(stops), 1));
  const markerMaterial = new ShaderMaterial({
    transparent: true, depthWrite: false,
    uniforms: { uColor: { value: terrain.colors.snow }, uProgress: material.uniforms.uProgress,
      uTime: { value: 0 }, uPulseSpeed: { value: Math.PI * 2 / worldTokens.motion.markerPeriod } },
    vertexShader: `attribute float stop; uniform float uTime,uPulseSpeed; varying float vStop;
      void main(){vStop=stop;float pulse=1.+sin(uTime*uPulseSpeed+stop*8.)*.08;
      gl_Position=projectionMatrix*modelViewMatrix*instanceMatrix*vec4(position*pulse,1.);}`,
    fragmentShader: `uniform vec3 uColor; uniform float uProgress; varying float vStop;
      void main(){float alpha=smoothstep(vStop-.03,vStop,uProgress);if(alpha<.01)discard;
      gl_FragColor=vec4(uColor,alpha*.9);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      }`,
  });
  const markers = new InstancedMesh(markerGeometry, markerMaterial, stops.length);
  const matrix = new Matrix4(), position = new Vector3();
  stops.forEach((stop, i) => { curve.getPoint(stop, position); position.y += 0.12;
    matrix.makeTranslation(position.x, position.y, position.z); markers.setMatrixAt(i, matrix); });
  markers.instanceMatrix.needsUpdate = true; group.add(markers);
  return {
    group,
    update(progress: number, time: number) {
      material.uniforms.uProgress.value = Math.max(0, Math.min(1, (progress - 0.35) / 0.25));
      markerMaterial.uniforms.uTime.value = time;
    },
    dispose() { geometry.dispose(); material.dispose(); markerGeometry.dispose(); markerMaterial.dispose(); markers.dispose(); },
  };
}
export type RouteModel = ReturnType<typeof createRoute>;
