import { BufferGeometry, Float32BufferAttribute, Group, ConeGeometry, DodecahedronGeometry,
  InstancedMesh, Mesh, MeshBasicMaterial, Object3D, ShaderMaterial } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { sampleHeight, valleyCenter, type TerrainData } from "@/lib/world/terrain";
import type { QualityTier } from "@/lib/world/quality";
import type { TerrainModel } from "./Terrain";

/** Two distant mountain ranges + near silhouettes, all in world space. */
export function createDepthLayers(data: TerrainData, terrain: TerrainModel, tier: QualityTier) {
  const group = new Group();
  const ridges: Mesh<BufferGeometry, ShaderMaterial>[] = [];
  for (let layer = 0; layer < 2; layer++) {
    const geometry = new BufferGeometry();
    const positions: number[] = [], indices: number[] = [];
    const columns = 96, rows = 8;
    for (let row = 0; row <= rows; row++) for (let col = 0; col <= columns; col++) {
      const x = (col / columns - 0.5) * 280;
      const ridge = 24 + Math.abs(Math.sin(x * .047 + layer * 2)) * 19
        + Math.abs(Math.sin(x * .113 + layer)) * 9 + Math.sin(x * .39) * 2;
      const crest = Math.pow(Math.sin(row / rows * Math.PI), .75);
      positions.push(x, -3 + ridge * crest, -104 - layer * 53 - row * 5);
      if (row < rows && col < columns) {
        const i = row * (columns + 1) + col;
        indices.push(i, i + columns + 1, i + 1, i + 1, i + columns + 1, i + columns + 2);
      }
    }
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    const material = new ShaderMaterial({
      uniforms: {
        uRock: { value: terrain.colors.rock }, uSand: { value: terrain.colors.sand },
        uSnow: { value: terrain.colors.snow }, uFog: terrain.material.uniforms.uFog,
        uSun: terrain.material.uniforms.uSunDirection, uLayer: { value: layer },
        uProgress: terrain.material.uniforms.uProgress,
      },
      vertexShader: `varying vec3 vWorld,vNormal;
        void main(){vWorld=position;vNormal=normal;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
      fragmentShader: `uniform vec3 uRock,uSand,uSnow,uFog,uSun;uniform float uLayer,uProgress;
        varying vec3 vWorld,vNormal;
        void main(){float light=max(0.,dot(normalize(vNormal),normalize(uSun)));
        vec3 color=mix(uRock,uSand,smoothstep(4.,42.,vWorld.y)*.7);
        float snow=smoothstep(32.,40.,vWorld.y)*smoothstep(.2,.7,normalize(vNormal).y);
        color=mix(color,uSnow,snow)*(.4+light*.85);
        color=mix(color,uFog,.13+uLayer*.12);
        color*=mix(.3,1.,smoothstep(0.,.12,uProgress));
        gl_FragColor=vec4(color,1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
        }`,
    });
    const mesh = new Mesh(geometry, material);
    ridges.push(mesh); group.add(mesh);
  }
  const count = tier === "low" ? 28 : 68;
  const crowns = [new ConeGeometry(.7, 1.7, 6), new ConeGeometry(.53, 1.6, 6), new ConeGeometry(.34, 1.4, 6)];
  crowns.forEach((crown, i) => crown.translate(0, .9 + i * .65, 0));
  const foliageGeometry = mergeGeometries(crowns);
  crowns.forEach(crown => crown.dispose());
  const rockGeometry = new DodecahedronGeometry(0.7, 0);
  const silhouette = new MeshBasicMaterial({ color: terrain.colors.deep });
  const trees = new InstancedMesh(foliageGeometry, silhouette, count);
  const rocks = new InstancedMesh(rockGeometry, silhouette, 36);
  const dummy = new Object3D();
  const random = (i: number) => { const n = Math.sin(i * 127.1 + 5.7) * 43758.5453; return n - Math.floor(n); };
  for (let i = 0; i < count; i++) {
    const z = -38 + random(i * 3) * 110;
    const x = valleyCenter(z) + (i % 2 ? -1 : 1) * (4.5 + random(i * 3 + 1) * 6);
    dummy.position.set(x, sampleHeight(data, x, z) - .1, z);
    dummy.rotation.set(0, random(i + 7) * Math.PI, 0);
    dummy.scale.setScalar(.45 + random(i * 3 + 2) * .5);
    dummy.updateMatrix(); trees.setMatrixAt(i, dummy.matrix);
  }
  for (let i = 0; i < 36; i++) {
    const z = 60 - i * 2.7;
    const x = valleyCenter(z) + (i % 2 ? -1 : 1) * (3.5 + random(i + 12) * 2.5);
    dummy.position.set(x, sampleHeight(data, x, z), z);
    dummy.rotation.set(random(i), random(i + 4), random(i + 8));
    dummy.scale.set(1 + random(i), .6 + random(i + 2), 1.2);
    dummy.updateMatrix(); rocks.setMatrixAt(i, dummy.matrix);
  }
  trees.instanceMatrix.needsUpdate = rocks.instanceMatrix.needsUpdate = true;
  trees.computeBoundingSphere(); rocks.computeBoundingSphere();
  group.add(trees, rocks);
  return { group, dispose() {
    ridges.forEach(mesh => { mesh.geometry.dispose(); mesh.material.dispose(); });
    trees.dispose(); rocks.dispose(); foliageGeometry.dispose(); rockGeometry.dispose(); silhouette.dispose();
  } };
}
export type DepthLayersModel = ReturnType<typeof createDepthLayers>;
