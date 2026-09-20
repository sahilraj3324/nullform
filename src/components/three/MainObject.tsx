import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { sceneState } from "./sceneState";

const lerp = THREE.MathUtils.lerp;
const smooth = (a: number, b: number, value: number) => THREE.MathUtils.smoothstep(value, a, b);

export default function MainObject({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const root = useRef<THREE.Group>(null); const core = useRef<THREE.Mesh>(null); const ringA = useRef<THREE.Mesh>(null); const ringB = useRef<THREE.Mesh>(null); const shell = useRef<THREE.Mesh>(null); const fragments = useRef<THREE.Group>(null);
  const fragmentData = useMemo(() => Array.from({ length: mobile ? 5 : 9 }, (_, i) => ({ position: new THREE.Vector3(Math.sin(i * 2.2) * 1.7, Math.cos(i * 1.7) * 1.45, (i % 3 - 1) * .8), scale: .08 + (i % 3) * .03 })), [mobile]);

  useFrame((state, delta) => {
    if (!root.current || !core.current || !ringA.current || !ringB.current || !shell.current || !fragments.current) return;
    const p = reduced ? 0 : sceneState.progress;
    const experienceIn = smooth(.24, .42, p); const experienceOut = smooth(.58, .72, p); const explode = Math.max(0, experienceIn - experienceOut); const finalReform = smooth(.86, .98, p);
    const targetX = mobile ? .25 : p < .15 ? 1.7 : p < .34 ? 2.15 : p < .58 ? 1.7 : p < .78 ? -1.8 : p < .9 ? 1.7 : 0;
    const targetY = p < .25 ? .15 : p < .6 ? -.1 : p < .84 ? .3 : 0;
    root.current.position.x = lerp(root.current.position.x, targetX, .045); root.current.position.y = lerp(root.current.position.y, targetY, .04);
    const targetScale = mobile ? .72 : p > .88 ? 1.14 : p > .6 ? .86 : 1;
    root.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), .04);
    if (!reduced) { root.current.rotation.y += delta * .055; root.current.rotation.x = lerp(root.current.rotation.x, sceneState.mouseY * .07 + p * 1.3, .025); root.current.rotation.z = lerp(root.current.rotation.z, sceneState.mouseX * .04 - p * .2, .025); }
    ringA.current.position.x = lerp(ringA.current.position.x, explode * 1.35 * (1 - finalReform), .055); ringB.current.position.x = lerp(ringB.current.position.x, -explode * 1.35 * (1 - finalReform), .055); core.current.position.z = lerp(core.current.position.z, explode * .8 * (1 - finalReform), .055); shell.current.scale.setScalar(1 + explode * .18 * (1 - finalReform)); fragments.current.scale.setScalar(1 + explode * 1.3 * (1 - finalReform));
    ringA.current.rotation.z += delta * .09; ringB.current.rotation.x -= delta * .07;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * .7) * .025; core.current.scale.setScalar(pulse);
  });

  const segments = mobile ? 48 : 96;
  return <group ref={root} position={[mobile ? .2 : 1.7, .15, 0]} rotation={[.3, -.5, .08]}>
    <mesh ref={core}><icosahedronGeometry args={[.78, mobile ? 3 : 5]} /><meshPhysicalMaterial color="#17151f" metalness={.82} roughness={.14} clearcoat={1} clearcoatRoughness={.08} emissive="#4a2fc9" emissiveIntensity={.25} /></mesh>
    <mesh ref={shell} rotation={[.7, .25, 0]}><torusKnotGeometry args={[1.14, .12, segments * 2, 16, 2, 3]} /><meshPhysicalMaterial color="#8070ff" metalness={.92} roughness={.18} clearcoat={1} /></mesh>
    <mesh ref={ringA} rotation={[Math.PI / 2.5, .15, .25]}><torusGeometry args={[1.52, .035, 12, segments]} /><meshPhysicalMaterial color="#eeeaff" metalness={1} roughness={.1} /></mesh>
    <mesh ref={ringB} rotation={[.3, Math.PI / 2.3, -.25]}><torusGeometry args={[1.82, .018, 10, segments]} /><meshBasicMaterial color="#5eead4" transparent opacity={.65} /></mesh>
    <group ref={fragments}>{fragmentData.map((fragment, i) => <mesh key={i} position={fragment.position} scale={fragment.scale} rotation={[i, i * .7, i * .25]}><octahedronGeometry args={[1, 0]} /><meshPhysicalMaterial color={i % 2 ? "#c8c2ff" : "#4c3ba8"} metalness={.9} roughness={.2} /></mesh>)}</group>
  </group>;
}
