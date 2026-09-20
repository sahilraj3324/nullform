import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { sceneState } from "./sceneState";

export default function CameraRig({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const { camera } = useThree(); const target = new THREE.Vector3();
  useFrame(() => { const p = reduced ? 0 : sceneState.progress; const push = p > .25 && p < .58 ? Math.sin((p - .25) / .33 * Math.PI) * .8 : 0; const x = (mobile ? 0 : sceneState.mouseX * .12) + (p > .58 && p < .82 ? .45 : 0); const y = mobile ? .2 : sceneState.mouseY * .08; camera.position.x = THREE.MathUtils.lerp(camera.position.x, x, .035); camera.position.y = THREE.MathUtils.lerp(camera.position.y, y, .035); camera.position.z = THREE.MathUtils.lerp(camera.position.z, (mobile ? 8 : 7) - push + (p > .88 ? 1.3 : 0), .035); target.set(p > .58 && p < .82 ? -.5 : mobile ? .1 : .65, 0, 0); camera.lookAt(target); });
  return null;
}
