import { worldTokens } from "./tokens";

export type TerrainData = {
  segments: number;
  positions: Float32Array<ArrayBuffer>;
  normals: Float32Array<ArrayBuffer>;
  cavity: Float32Array<ArrayBuffer>;
  shadows: Float32Array<ArrayBuffer>;
  indices: Uint32Array<ArrayBuffer>;
  heights: Float32Array<ArrayBuffer>;
  noise: Uint8Array<ArrayBuffer>;
};
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const hash = (x: number, z: number) => {
  const n = Math.sin(x * 127.1 + z * 311.7 + 19.19) * 43758.5453;
  return n - Math.floor(n);
};
function noise(x: number, z: number) {
  const ix = Math.floor(x), iz = Math.floor(z);
  return mix(mix(hash(ix, iz), hash(ix + 1, iz), fade(x - ix)),
    mix(hash(ix, iz + 1), hash(ix + 1, iz + 1), fade(x - ix)), fade(z - iz));
}
function fbm(x: number, z: number, ridged = false) {
  let result = 0, amplitude = 0.5;
  for (let i = 0; i < 5; i++) {
    let n = noise(x, z);
    if (ridged) { n = 1 - Math.abs(n * 2 - 1); n *= n; }
    result += n * amplitude;
    x = x * 2.07 + 13.7; z = z * 2.03 - 8.3; amplitude *= 0.5;
  }
  return result;
}
export function valleyCenter(z: number) { return Math.sin(z * 0.065) * 5 + Math.sin(z * 0.17) * 1.3; }

function elevation(x: number, z: number) {
  const wx = x + (fbm(x * 0.035, z * 0.035) - 0.45) * 12;
  const wz = z + (fbm(x * 0.035 + 17, z * 0.035 - 9) - 0.45) * 10;
  const distance = Math.abs(x - valleyCenter(z));
  const walls = 1 - Math.exp(-(distance * distance) / 95);
  const chain = 8 + fbm(wx * 0.048, wz * 0.048, true) * 26;
  const peaks = Math.exp(-((x + 19) ** 2 / 90 + (z + 48) ** 2 / 280)) * 11
    + Math.exp(-((x - 22) ** 2 / 150 + (z + 14) ** 2 / 420)) * 8;
  // Ravinas pequenas ao longo das escarpas, sem texturas fotográficas.
  const gullies = Math.pow(1 - Math.abs(noise(wx * 0.23, wz * 0.09) * 2 - 1), 8) * 1.4 * walls;
  return 1.2 + walls * chain + peaks - gullies + fbm(wx * 0.2, wz * 0.2) * 0.7;
}

/** Executado exclusivamente pelo worker; buffers transferidos sem cópia. */
export function generateTerrain(segments: number): TerrainData {
  const { width, depth } = worldTokens.terrain;
  const side = segments + 1, count = side * side;
  let heights = new Float32Array(count);
  for (let row = 0; row < side; row++) for (let col = 0; col < side; col++) {
    heights[row * side + col] = elevation((col / segments - 0.5) * width, (row / segments - 0.5) * depth);
  }
  // Erosão térmica conservativa: material desce para o vizinho mais baixo.
  for (let pass = 0; pass < 4; pass++) {
    const eroded = heights.slice();
    const talus = (width / segments) * 1.15;
    for (let row = 1; row < segments; row++) for (let col = 1; col < segments; col++) {
      const i = row * side + col;
      let lowest = i;
      for (const j of [i - 1, i + 1, i - side, i + side]) if (heights[j] < heights[lowest]) lowest = j;
      const excess = heights[i] - heights[lowest] - talus;
      if (excess > 0) { const transfer = excess * 0.16; eroded[i] -= transfer; eroded[lowest] += transfer; }
    }
    heights = eroded;
  }
  const positions = new Float32Array(count * 3), normals = new Float32Array(count * 3);
  const cavity = new Float32Array(count), indices = new Uint32Array(segments * segments * 6);
  let index = 0;
  for (let row = 0; row < side; row++) for (let col = 0; col < side; col++) {
    const i = row * side + col, p = i * 3;
    const left = heights[row * side + Math.max(0, col - 1)], right = heights[row * side + Math.min(segments, col + 1)];
    const back = heights[Math.max(0, row - 1) * side + col], front = heights[Math.min(segments, row + 1) * side + col];
    positions[p] = (col / segments - 0.5) * width;
    positions[p + 1] = heights[i]; positions[p + 2] = (row / segments - 0.5) * depth;
    const nx = (left - right) / (width / segments * 2), nz = (back - front) / (depth / segments * 2);
    const length = Math.hypot(nx, 1, nz);
    normals[p] = nx / length; normals[p + 1] = 1 / length; normals[p + 2] = nz / length;
    cavity[i] = Math.max(0, Math.min(1, ((left + right + back + front) / 4 - heights[i]) * 1.4));
    if (row < segments && col < segments) { indices.set([i, i + side, i + 1, i + 1, i + side, i + side + 1], index); index += 6; }
  }
  const cloudNoise = new Uint8Array(128 * 128 * 4);
  for (let z = 0; z < 128; z++) for (let x = 0; x < 128; x++) {
    const i = (z * 128 + x) * 4, value = Math.round(fbm(x / 16, z / 16) * 255);
    cloudNoise[i] = cloudNoise[i + 1] = cloudNoise[i + 2] = value; cloudNoise[i + 3] = 255;
  }
  const shadows = new Float32Array(count * 3);
  const data = { segments, positions, normals, cavity, shadows, indices, heights, noise: cloudNoise };
  // Real terrain occlusion, baked for dawn / noon / dusk off the main thread.
  // Interpolating three sun states avoids a shadow-map pass on every mobile frame.
  for (let i = 0; i < count; i++) {
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2];
    for (let sun = 0; sun < 3; sun++) {
      const dx = [-0.75, 0, 0.75][sun], dy = [0.23, 0.53, 0.23][sun];
      let visibility = 1;
      for (let step = 1; step <= 16; step++) {
        const distance = step * 2;
        const sx = x + dx * distance, sz = z + 0.45 * distance;
        if (Math.abs(sx) > width / 2 || Math.abs(sz) > depth / 2) break;
        const obstruction = sampleHeight(data, sx, sz) - (y + dy * distance + 0.25);
        visibility = Math.min(visibility, Math.max(0, 1 - obstruction * 1.8));
        if (visibility === 0) break;
      }
      shadows[i * 3 + sun] = visibility;
    }
  }
  return data;
}

/** Interpolação da mesma triangulação da malha, para câmera e rota. */
export function sampleHeight(data: TerrainData, x: number, z: number) {
  const { width, depth } = worldTokens.terrain;
  const n = data.segments, side = n + 1;
  const gx = Math.max(0, Math.min(n - 0.001, (x / width + 0.5) * n));
  const gz = Math.max(0, Math.min(n - 0.001, (z / depth + 0.5) * n));
  const col = Math.floor(gx), row = Math.floor(gz), u = gx - col, v = gz - row;
  const i = row * side + col, h = data.heights;
  return u + v <= 1 ? h[i] + u * (h[i + 1] - h[i]) + v * (h[i + side] - h[i])
    : h[i + side + 1] + (1 - u) * (h[i + side] - h[i + side + 1]) + (1 - v) * (h[i + 1] - h[i + side + 1]);
}
