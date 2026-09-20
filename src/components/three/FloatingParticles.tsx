import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Points } from "three";
import { sceneState } from "./sceneState";

export default function FloatingParticles({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const ref = useRef<Points>(null); const count = mobile ? 260 : 800;
  const positions = useMemo(() => { const data = new Float32Array(count * 3); for (let i = 0; i < count; i++) { data[i * 3] = (Math.random() - .5) * 18; data[i * 3 + 1] = (Math.random() - .5) * 12; data[i * 3 + 2] = (Math.random() - .5) * 9 - 2; } return data; }, [count]);
  useFrame((_, delta) => { if (!ref.current || reduced) return; ref.current.rotation.y += delta * .006; ref.current.rotation.x += (sceneState.mouseY * .02 - ref.current.rotation.x) * .01; });
  return <points ref={ref}><bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry><pointsMaterial color="#9b8aff" size={mobile ? .016 : .022} transparent opacity={.32} sizeAttenuation depthWrite={false} /></points>;
}
