import { PerspectiveCamera, Vector3 } from "three";
import { createJourney } from "@/lib/world/journey";
import { getJourneyProgress, subscribeJourney } from "@/lib/world/progress";
import { sampleHeight, type TerrainData } from "@/lib/world/terrain";

export function createCameraRig(camera: PerspectiveCamera, data: TerrainData, invalidate: () => void) {
  const curves = createJourney(data);
  const position = new Vector3(), target = new Vector3();
  const unsubscribe = subscribeJourney(invalidate);
  let last = -1;
  return {
    update() {
      const progress = getJourneyProgress();
      curves.camera.getPoint(progress, position);
      curves.look.getPoint(progress, target);
      position.y = Math.max(position.y, sampleHeight(data, position.x, position.z) + 3.2);
      camera.position.copy(position);
      camera.lookAt(target);
      const fov = 52 + Math.sin(progress * Math.PI) * 7 - Math.max(0, progress - 0.6) * 18;
      if (Math.abs(camera.fov - fov) > 0.015) { camera.fov = fov; camera.updateProjectionMatrix(); }
      last = progress;
      return progress;
    },
    moving() { return Math.abs(getJourneyProgress() - last) > 0.00001; },
    dispose: unsubscribe,
  };
}
export type CameraRigModel = ReturnType<typeof createCameraRig>;
