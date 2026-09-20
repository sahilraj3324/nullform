import * as THREE from "three";

export const sceneState = { progress: 0, mouseX: 0, mouseY: 0 };

/* Shared sun direction. The light rig and the atmosphere shader have to agree on this or the
   scattering glow drifts off the terminator. Angled to the side so the planet shows a phase
   rather than sitting flat and fully front-lit. */
export const SUN = new THREE.Vector3(7.5, 4.2, 5.4).normalize();
export const SUN_POSITION = SUN.clone().multiplyScalar(15);
