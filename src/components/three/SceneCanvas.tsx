import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import CameraRig from "./CameraRig";
import SceneEnvironment from "./Environment";
import FloatingParticles from "./FloatingParticles";
import Lights from "./Lights";
import MainObject from "./MainObject";
import PostProcessing from "./PostProcessing";
import SceneLoader from "./SceneLoader";
import ScrollSceneController from "./ScrollSceneController";

export default function SceneCanvas() {
  const mobile = useIsMobile(); const reduced = useReducedMotion();
  const supported = useMemo(() => { try { const canvas = document.createElement("canvas"); return !!(canvas.getContext("webgl2") || canvas.getContext("webgl")); } catch { return false; } }, []);
  if (!supported) return <div className="webgl-fallback" />;
  return <><div className="scene-canvas"><Canvas shadows dpr={mobile ? 1 : [1, 1.75]} camera={{ fov: mobile ? 45 : 39, position: [0, 0, mobile ? 8 : 7] }} gl={{ alpha: true, antialias: !mobile, powerPreference: "high-performance", toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1 }}><Suspense fallback={null}><color attach="background" args={["#050505"]} /><fog attach="fog" args={["#050505", 8, 17]} /><Lights /><SceneEnvironment /><MainObject mobile={mobile} reduced={reduced} /><FloatingParticles mobile={mobile} reduced={reduced} /><CameraRig mobile={mobile} reduced={reduced} /><ScrollSceneController /><PostProcessing /></Suspense></Canvas></div><SceneLoader /></>;
}
