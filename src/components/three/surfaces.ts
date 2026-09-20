import * as THREE from "three";

/* Procedural micro-surface maps. Perfectly smooth materials read as CG plastic,
   so every metal in the scene gets a tileable fBm roughness + normal map to break
   up its specular highlights the way a real machined/polished surface does. */

const RES = 256;

const mulberry32 = (seed: number) => () => { seed = seed + 0x6d2b79f5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const fade = (t: number) => t * t * (3 - 2 * t);

const lattice = (n: number, rand: () => number) => { const grid = new Float32Array(n * n); for (let i = 0; i < grid.length; i++) grid[i] = rand(); return grid; };

function sampleTiled(grid: Float32Array, n: number, x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y), tx = fade(x - xi), ty = fade(y - yi);
  const i0 = ((xi % n) + n) % n, j0 = ((yi % n) + n) % n, i1 = (i0 + 1) % n, j1 = (j0 + 1) % n;
  const a = grid[j0 * n + i0], b = grid[j0 * n + i1], c = grid[j1 * n + i0], d = grid[j1 * n + i1];
  return (a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty;
}

function fbmField(seed: number, octaves: number) {
  const rand = mulberry32(seed); const field = new Float32Array(RES * RES); let amplitude = 1, total = 0;
  for (let octave = 0; octave < octaves; octave++) {
    const n = 4 << octave, grid = lattice(n, rand);
    for (let y = 0; y < RES; y++) for (let x = 0; x < RES; x++) field[y * RES + x] += sampleTiled(grid, n, x / RES * n, y / RES * n) * amplitude;
    total += amplitude; amplitude *= .5;
  }
  for (let i = 0; i < field.length; i++) field[i] /= total;
  return field;
}

function paint(draw: (data: Uint8ClampedArray) => void) {
  const canvas = document.createElement("canvas"); canvas.width = canvas.height = RES;
  const context = canvas.getContext("2d")!; const image = context.createImageData(RES, RES);
  draw(image.data); context.putImageData(image, 0, 0); return canvas;
}

let heightField: Float32Array | null = null;
let roughnessCanvas: HTMLCanvasElement | null = null;
let normalCanvas: HTMLCanvasElement | null = null;

function sources() {
  const field = (heightField ??= fbmField(20260920, 6));
  const roughness = (roughnessCanvas ??= paint(data => { for (let i = 0; i < field.length; i++) { const value = Math.round(THREE.MathUtils.clamp(.42 + field[i] * .78, 0, 1) * 255); data[i * 4] = data[i * 4 + 1] = data[i * 4 + 2] = value; data[i * 4 + 3] = 255; } }));
  const normal = (normalCanvas ??= paint(data => {
    const at = (x: number, y: number) => field[(((y % RES) + RES) % RES) * RES + (((x % RES) + RES) % RES)];
    for (let y = 0; y < RES; y++) for (let x = 0; x < RES; x++) {
      const dx = (at(x - 1, y) - at(x + 1, y)) * 5.5, dy = (at(x, y - 1) - at(x, y + 1)) * 5.5;
      const length = Math.hypot(dx, dy, 1), i = (y * RES + x) * 4;
      data[i] = Math.round((dx / length * .5 + .5) * 255); data[i + 1] = Math.round((dy / length * .5 + .5) * 255); data[i + 2] = Math.round((1 / length * .5 + .5) * 255); data[i + 3] = 255;
    }
  }));
  return { roughness, normal };
}

function fromCanvas(canvas: HTMLCanvasElement, repeatX: number, repeatY: number) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping; texture.repeat.set(repeatX, repeatY);
  texture.colorSpace = THREE.NoColorSpace; texture.anisotropy = 8; return texture;
}

/** Tileable roughness + normal pair, tiled to the density the surface needs. */
export function surfaceMaps(repeatX: number, repeatY: number) {
  const { roughness, normal } = sources();
  return { roughnessMap: fromCanvas(roughness, repeatX, repeatY), normalMap: fromCanvas(normal, repeatX, repeatY) };
}
