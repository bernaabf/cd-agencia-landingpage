import { CatmullRomCurve3, Vector3 } from "three";
import { sampleHeight, type TerrainData, valleyCenter } from "./terrain";

/** Art-directed Alps, not geographical elevation data. No second scroll controller. */
export function createJourney(data: TerrainData) {
  const point = (x: number, z: number, clearance: number) => new Vector3(x, sampleHeight(data, x, z) + clearance, z);
  const flight = (z: number, offset: number, clearance: number) => point(valleyCenter(z) + offset, z, clearance);
  const camera = new CatmullRomCurve3([
    new Vector3(12, 29, 65), flight(45, 5, 15), flight(27, 1.2, 8),
    flight(5, -1.4, 4), flight(-15, 1.2, 5), flight(-27, 3, 12),
    new Vector3(10, 39, -12), new Vector3(17, 47, -6),
  ], false, "centripetal");
  const look = new CatmullRomCurve3([
    new Vector3(-5, 13, -30), flight(5, -2, 8), flight(-8, 0, 2),
    flight(-27, 0, 0.5), flight(-42, 0, 1.5), point(-17, -49, 9),
    new Vector3(-8, 26, -95), new Vector3(-6, 29, -115),
  ], false, "centripetal");
  return { camera, look };
}
