import { generateTerrain, type TerrainData } from "./terrain";
const scope = self as unknown as {
  onmessage: ((event: MessageEvent<{ segments: number }>) => void) | null;
  postMessage: (data: TerrainData, transfer: Transferable[]) => void;
};
scope.onmessage = ({ data }) => {
  const terrain = generateTerrain(data.segments);
  scope.postMessage(terrain, [terrain.positions.buffer, terrain.normals.buffer,
    terrain.cavity.buffer, terrain.shadows.buffer, terrain.indices.buffer, terrain.heights.buffer, terrain.noise.buffer]);
};
