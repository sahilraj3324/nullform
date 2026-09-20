import { Environment, Lightformer } from "@react-three/drei";

/* Space, not a studio. The environment map only has to give the rings, the moon and the debris
   a faint bounce so their unlit sides aren't pure black — anything brighter starts filling in
   the planet's night side and kills the terminator. Rendered once (frames=1). */
export default function SceneEnvironment() {
  return <Environment resolution={128} frames={1}>
    <color attach="background" args={["#05050a"]} />
    <Lightformer form="rect" intensity={2.2} position={[0, 6, -1]} scale={[14, 7, 1]} color="#2e2a45" />
    <Lightformer form="rect" intensity={3} position={[-6, 1.5, 2.5]} scale={[8, 5, 1]} color="#4a3a9c" />
    <Lightformer form="rect" intensity={2} position={[6.5, -1.2, 1.5]} scale={[7, 4, 1]} color="#1f5f58" />
    <Lightformer form="ring" intensity={1.6} position={[0, 0, -7]} scale={6.5} color="#2c2266" />
  </Environment>;
}
