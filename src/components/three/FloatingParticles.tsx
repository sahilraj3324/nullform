import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { Points } from "three";
import { sceneState } from "./sceneState";

/* Soft round sprite — the default square point sprite is the giveaway that dust is fake. */
function dustTexture() {
  const size = 64, canvas = document.createElement("canvas"); canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!; const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)"); gradient.addColorStop(.35, "rgba(255,255,255,.55)"); gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient; context.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function FloatingParticles({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const ref = useRef<Points>(null); const count = mobile ? 260 : 800;
  const sprite = useMemo(dustTexture, []);
  const positions = useMemo(() => { const data = new Float32Array(count * 3); for (let i = 0; i < count; i++) { data[i * 3] = (Math.random() - .5) * 18; data[i * 3 + 1] = (Math.random() - .5) * 12; data[i * 3 + 2] = (Math.random() - .5) * 9 - 2; } return data; }, [count]);
  useFrame((_, delta) => { if (!ref.current || reduced) return; ref.current.rotation.y += delta * .006; ref.current.rotation.x += (sceneState.mouseY * .02 - ref.current.rotation.x) * .01; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial map={sprite} color="#9b8aff" size={mobile ? .03 : .042} transparent opacity={.4} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} /></points>;
}
