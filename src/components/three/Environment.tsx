import { Environment, Lightformer } from "@react-three/drei";

export default function SceneEnvironment() { return <Environment resolution={64}><group rotation={[-Math.PI / 2, 0, 0]}><Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 4, -6]} scale={[10, 2, 1]} /><Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, 0]} scale={[5, 2, 1]} color="#7056ff" /><Lightformer intensity={1.5} rotation-y={-Math.PI / 2} position={[5, -1, 1]} scale={[4, 2, 1]} color="#5eead4" /></group></Environment>; }
