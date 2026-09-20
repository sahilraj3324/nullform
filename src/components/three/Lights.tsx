import { SUN_POSITION } from "./sceneState";

/* One sun, everything else barely there. A planet lit from several directions stops reading
   as a planet, so the fills only lift the night side enough to keep it from crushing to black.
   The sun casts: the ring shadow banding the planet is most of what sells the scale. */
export default function Lights() {
  return <>
    <ambientLight intensity={.1} />
    <directionalLight castShadow position={SUN_POSITION} intensity={3.1} color="#fff4e8" shadow-mapSize={[1024, 1024]} shadow-bias={-.0006} shadow-normalBias={.02} shadow-camera-near={1} shadow-camera-far={40} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5} />
    <directionalLight position={[-7, -2, -5]} intensity={.3} color="#7c5cff" />
    <pointLight position={[4, -3.5, 2]} intensity={4} distance={10} decay={2} color="#5eead4" />
  </>;
}
