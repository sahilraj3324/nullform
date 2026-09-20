import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { planetMaps, ringGeometry } from "./planet";
import { SUN, sceneState } from "./sceneState";
import { surfaceMaps } from "./surfaces";

const lerp = THREE.MathUtils.lerp;
const smooth = (a: number, b: number, value: number) => THREE.MathUtils.smoothstep(value, a, b);

/* Atmosphere: fresnel at the limb, scaled by how much of that limb faces the sun, so the
   day side carries a bright halo and the night side only a faint edge — Rayleigh scattering
   cheaply faked, which is what sells a sphere as a planet rather than a ball. */
const atmosphereVertex = `varying vec3 vWorldNormal; varying vec3 vViewDir;
void main() { vec4 world = modelMatrix * vec4(position, 1.); vWorldNormal = normalize(mat3(modelMatrix) * normal); vViewDir = normalize(cameraPosition - world.xyz); gl_Position = projectionMatrix * viewMatrix * world; }`;
const atmosphereFragment = `uniform vec3 uColor; uniform vec3 uSun; uniform float uPower; uniform float uIntensity;
varying vec3 vWorldNormal; varying vec3 vViewDir;
void main() {
  vec3 normal = normalize(vWorldNormal);
  float facing = 1. - abs(dot(normal, normalize(vViewDir)));
  float limb = pow(facing, uPower);
  float day = smoothstep(-.45, .6, dot(normal, normalize(uSun)));
  float glow = limb * (1. - pow(limb, 4.)) * (.12 + .88 * day);
  gl_FragColor = vec4(uColor * glow * uIntensity, glow * uIntensity);
}`;


export default function MainObject({ mobile, reduced }: { mobile: boolean; reduced: boolean }) {
  const root = useRef<THREE.Group>(null); const planet = useRef<THREE.Mesh>(null); const clouds = useRef<THREE.Mesh>(null); const rings = useRef<THREE.Mesh>(null); const orbit = useRef<THREE.Mesh>(null); const moonPivot = useRef<THREE.Group>(null); const debris = useRef<THREE.Group>(null);
  const maps = useMemo(() => planetMaps(mobile ? 512 : 1024), [mobile]);
  const rock = useMemo(() => surfaceMaps(3, 2), []);
  const ringMesh = useMemo(() => ringGeometry(1.34, 2.08, mobile ? 128 : 256), [mobile]);
  const reliefScale = useMemo(() => new THREE.Vector2(.85, .85), []);
  const moonReliefScale = useMemo(() => new THREE.Vector2(.9, .9), []);
  const atmosphereUniforms = useMemo(() => ({ uColor: { value: new THREE.Color("#8ab4ff") }, uSun: { value: SUN.clone() }, uPower: { value: 2.8 }, uIntensity: { value: 1.55 } }), []);
  const haloUniforms = useMemo(() => ({ uColor: { value: new THREE.Color("#6f5cff") }, uSun: { value: SUN.clone() }, uPower: { value: 1.7 }, uIntensity: { value: .3 } }), []);
  const debrisData = useMemo(() => {
    const count = mobile ? 5 : 9, golden = Math.PI * (3 - Math.sqrt(5));
    return Array.from({ length: count }, (_, i) => {
      const y = 1 - (i / (count - 1)) * 2, band = Math.sqrt(Math.max(0, 1 - y * y)), theta = golden * i;
      return { position: new THREE.Vector3(Math.cos(theta) * band * 2.15, y * .5, Math.sin(theta) * band * 2.15), rotation: new THREE.Euler(i * .9, i * .7, i * .35), scale: .045 + (i % 3) * .022 };
    });
  }, [mobile]);

  useFrame((state, delta) => {
    if (!root.current || !planet.current || !clouds.current || !rings.current || !orbit.current || !moonPivot.current || !debris.current) return;
    const p = reduced ? 0 : sceneState.progress; const time = state.clock.elapsedTime;
    const experienceIn = smooth(.24, .42, p); const experienceOut = smooth(.58, .72, p); const spread = Math.max(0, experienceIn - experienceOut); const finalReform = smooth(.86, .98, p); const open = spread * (1 - finalReform);
    const drift = reduced ? 0 : Math.sin(time * .42) * .06;
    const targetX = mobile ? .1 : p < .15 ? 1.7 : p < .34 ? 2.15 : p < .58 ? 1.7 : p < .78 ? -1.8 : p < .9 ? 1.7 : 0;
    const targetY = (p < .25 ? .15 : p < .6 ? -.1 : p < .84 ? .3 : 0) + drift;
    root.current.position.x = lerp(root.current.position.x, targetX, .045); root.current.position.y = lerp(root.current.position.y, targetY, .04);
    const targetScale = mobile ? .62 : p > .88 ? 1.14 : p > .6 ? .86 : 1;
    root.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), .04);
    if (!reduced) { root.current.rotation.x = lerp(root.current.rotation.x, sceneState.mouseY * .07 + .46 + p * .4, .025); root.current.rotation.y = lerp(root.current.rotation.y, sceneState.mouseX * .12 - p * .3, .025); }
    if (!reduced) { planet.current.rotation.y += delta * .028; clouds.current.rotation.y += delta * .039; }
    rings.current.scale.setScalar(1 + open * .16);
    orbit.current.rotation.z += delta * .02; orbit.current.position.x = lerp(orbit.current.position.x, open * 1.1, .055);
    moonPivot.current.rotation.y += delta * .2; moonPivot.current.scale.setScalar(1 + open * .55);
    debris.current.rotation.y += delta * .05; debris.current.scale.setScalar(1 + open * .95);
  });

  const segments = mobile ? 64 : 128;
  return <group ref={root} position={[mobile ? .1 : 1.7, .15, 0]} rotation={[.46, -.5, 0]}>
    <group rotation={[0, 0, .4]}>{/* axial tilt — shared by the body and its ring plane */}
      <mesh ref={planet} castShadow receiveShadow>
        <sphereGeometry args={[1, segments * 2, segments]} />
        <meshStandardMaterial map={maps.map} normalMap={maps.normalMap} normalScale={reliefScale} roughnessMap={maps.roughnessMap} roughness={1} metalness={0} envMapIntensity={.16} />
      </mesh>
      <mesh ref={clouds} scale={1.016}>
        <sphereGeometry args={[1, segments, segments / 2]} />
        <meshStandardMaterial alphaMap={maps.clouds} color="#ffffff" transparent depthWrite={false} roughness={1} metalness={0} envMapIntensity={.2} />
      </mesh>
      <mesh scale={1.055}>
        <sphereGeometry args={[1, 64, 40]} />
        <shaderMaterial uniforms={atmosphereUniforms} vertexShader={atmosphereVertex} fragmentShader={atmosphereFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} toneMapped={false} />
      </mesh>
      <mesh ref={rings} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <primitive object={ringMesh} attach="geometry" />
        <meshStandardMaterial map={maps.rings} transparent side={THREE.DoubleSide} depthWrite={false} roughness={.85} metalness={.1} envMapIntensity={.8} alphaTest={.01} />
      </mesh>
      <mesh ref={orbit} rotation={[Math.PI / 2.1, .2, 0]}>
        <torusGeometry args={[2.5, .005, 8, segments * 3]} />
        <meshBasicMaterial color="#5eead4" transparent opacity={.3} toneMapped={false} />
      </mesh>
      <group ref={moonPivot} rotation={[0, 1.1, 0]}>
        <mesh position={[1.9, .34, .8]} scale={.115} castShadow receiveShadow>
          <icosahedronGeometry args={[1, 4]} />
          <meshStandardMaterial color="#8d88a4" {...rock} normalScale={moonReliefScale} roughness={1} metalness={0} envMapIntensity={.3} />
        </mesh>
      </group>
      <group ref={debris}>{debrisData.map((shard, i) => <mesh key={i} position={shard.position} rotation={shard.rotation} scale={shard.scale}>
        {i % 2 ? <octahedronGeometry args={[1, 0]} /> : <icosahedronGeometry args={[1, 0]} />}
        <meshStandardMaterial color={i % 2 ? "#7a7490" : "#514a72"} roughness={.85} metalness={.05} envMapIntensity={.4} flatShading />
      </mesh>)}</group>
    </group>
    {/* soft outer bloom so the planet sits in light rather than being cut out of the page */}
    <mesh scale={2.1} renderOrder={-1}>
      <sphereGeometry args={[1, 48, 32]} />
      <shaderMaterial uniforms={haloUniforms} vertexShader={atmosphereVertex} fragmentShader={atmosphereFragment} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  </group>;
}
