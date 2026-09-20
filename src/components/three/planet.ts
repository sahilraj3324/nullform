import * as THREE from "three";

/* Procedural planet maps. Everything is sampled from 3D noise along the sphere direction
   rather than across the flat image, so the equirectangular texture has no pole pinching
   and no seam at the date line. Built once per resolution and cached. */

const fade = (t: number) => t * t * (3 - 2 * t);

function hash(x: number, y: number, z: number) {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(z, 1274126177) | 0;
  h = Math.imul(h ^ h >>> 13, 1274126177);
  return ((h ^ h >>> 16) >>> 0) / 4294967295;
}

function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z);
  const tx = fade(x - xi), ty = fade(y - yi), tz = fade(z - zi);
  const c = (dx: number, dy: number, dz: number) => hash(xi + dx, yi + dy, zi + dz);
  const x00 = c(0, 0, 0) + (c(1, 0, 0) - c(0, 0, 0)) * tx, x10 = c(0, 1, 0) + (c(1, 1, 0) - c(0, 1, 0)) * tx;
  const x01 = c(0, 0, 1) + (c(1, 0, 1) - c(0, 0, 1)) * tx, x11 = c(0, 1, 1) + (c(1, 1, 1) - c(0, 1, 1)) * tx;
  return (x00 + (x10 - x00) * ty) * (1 - tz) + (x01 + (x11 - x01) * ty) * tz;
}

function fbm(x: number, y: number, z: number, octaves: number) {
  let sum = 0, amplitude = 1, total = 0, frequency = 1;
  for (let i = 0; i < octaves; i++) { sum += noise3(x * frequency, y * frequency, z * frequency) * amplitude; total += amplitude; amplitude *= .5; frequency *= 2; }
  return sum / total;
}

const canvasOf = (width: number, height: number) => { const canvas = document.createElement("canvas"); canvas.width = width; canvas.height = height; return canvas; };

function texture(canvas: HTMLCanvasElement, srgb: boolean) {
  const map = new THREE.CanvasTexture(canvas);
  map.wrapS = THREE.RepeatWrapping; map.wrapT = THREE.ClampToEdgeWrapping;
  map.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace; map.anisotropy = 8;
  return map;
}

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const ramp = (stops: [number, number, number][], t: number, i: number) => mix(stops[0][i], stops[1][i], t);

export type PlanetMaps = { map: THREE.Texture; normalMap: THREE.Texture; roughnessMap: THREE.Texture; clouds: THREE.Texture; rings: THREE.Texture };

const cache = new Map<number, PlanetMaps>();

const SEA = .5;

function terrain(width: number, height: number) {
  const elevation = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    const lat = (.5 - (y + .5) / height) * Math.PI, cosLat = Math.cos(lat), sinLat = Math.sin(lat);
    for (let x = 0; x < width; x++) {
      const lon = (x + .5) / width * Math.PI * 2;
      const dx = cosLat * Math.cos(lon), dy = sinLat, dz = cosLat * Math.sin(lon);
      // domain warp first — straight fbm gives round blobby islands, warped fbm gives coastlines
      const warp = fbm(dx * 2.1 + 11.3, dy * 2.1 + 4.7, dz * 2.1 + 19.1, 2) - .5;
      const s = 1.55, o = warp * .55;
      elevation[y * width + x] = fbm(dx * s + o + 3.2, dy * s + o + 8.6, dz * s + o + 1.4, 6);
    }
  }
  return elevation;
}

function planetSurface(width: number, height: number, elevation: Float32Array) {
  const albedo = canvasOf(width, height), rough = canvasOf(width, height), normal = canvasOf(width, height);
  const albedoContext = albedo.getContext("2d")!, roughContext = rough.getContext("2d")!, normalContext = normal.getContext("2d")!;
  const albedoData = albedoContext.createImageData(width, height), roughData = roughContext.createImageData(width, height), normalData = normalContext.createImageData(width, height);
  const at = (x: number, y: number) => elevation[Math.min(height - 1, Math.max(0, y)) * width + (((x % width) + width) % width)];

  const ocean: [number, number, number][] = [[12, 27, 60], [26, 96, 112]];
  const lowland: [number, number, number][] = [[38, 34, 52], [72, 64, 88]];
  const highland: [number, number, number][] = [[82, 75, 102], [178, 172, 198]];

  for (let y = 0; y < height; y++) {
    const polar = THREE.MathUtils.smoothstep(Math.abs((y + .5) / height * 2 - 1), .74, .97);
    for (let x = 0; x < width; x++) {
      const i = y * width + x, offset = i * 4, h = elevation[i];
      const land = h >= SEA;
      let r: number, g: number, b: number, roughness: number;
      if (land) {
        const t = (h - SEA) / (1 - SEA);
        if (t < .55) { const k = t / .55; r = ramp(lowland, k, 0); g = ramp(lowland, k, 1); b = ramp(lowland, k, 2); }
        else { const k = THREE.MathUtils.smoothstep(t, .55, 1); r = ramp(highland, k, 0); g = ramp(highland, k, 1); b = ramp(highland, k, 2); }
        roughness = 210 - t * 40;
      } else {
        const k = THREE.MathUtils.smoothstep(h, SEA - .17, SEA);
        r = ramp(ocean, k, 0); g = ramp(ocean, k, 1); b = ramp(ocean, k, 2);
        roughness = 74 + k * 32; // water stays glossier than land — this is the sun glint
      }
      // ice caps, thicker where the terrain is already high
      const ice = Math.min(1, polar * (land ? 1 : .82));
      r = mix(r, 236, ice); g = mix(g, 238, ice); b = mix(b, 250, ice); roughness = mix(roughness, 150, ice);
      albedoData.data[offset] = r; albedoData.data[offset + 1] = g; albedoData.data[offset + 2] = b; albedoData.data[offset + 3] = 255;
      roughData.data[offset] = roughData.data[offset + 1] = roughData.data[offset + 2] = roughness; roughData.data[offset + 3] = 255;

      // relief only on land — a bumpy ocean surface reads as plastic
      const relief = land ? 42 * (1 - ice * .7) : 0;
      const nx = (at(x - 1, y) - at(x + 1, y)) * relief, ny = (at(x, y - 1) - at(x, y + 1)) * relief;
      const length = Math.hypot(nx, ny, 1);
      normalData.data[offset] = Math.round((nx / length * .5 + .5) * 255); normalData.data[offset + 1] = Math.round((ny / length * .5 + .5) * 255);
      normalData.data[offset + 2] = Math.round((1 / length * .5 + .5) * 255); normalData.data[offset + 3] = 255;
    }
  }
  albedoContext.putImageData(albedoData, 0, 0); roughContext.putImageData(roughData, 0, 0); normalContext.putImageData(normalData, 0, 0);
  return { albedo, rough, normal };
}

function cloudCanvas(width: number, height: number) {
  const canvas = canvasOf(width, height), context = canvas.getContext("2d")!, image = context.createImageData(width, height);
  for (let y = 0; y < height; y++) {
    const lat = (.5 - (y + .5) / height) * Math.PI, cosLat = Math.cos(lat), sinLat = Math.sin(lat);
    // weather bands: cloud cover peaks around the equator and the mid latitudes
    const bands = .5 + .5 * Math.cos(lat * 5.2);
    for (let x = 0; x < width; x++) {
      const lon = (x + .5) / width * Math.PI * 2;
      const dx = cosLat * Math.cos(lon) * 2.4, dy = sinLat * 2.4, dz = cosLat * Math.sin(lon) * 2.4;
      const density = fbm(dx + 42.1, dy * 2.6 + 7.9, dz + 63.4, 5);
      const alpha = Math.pow(THREE.MathUtils.smoothstep(density * (.52 + bands * .6), .46, .8), 1.35);
      const offset = (y * width + x) * 4, value = Math.round(alpha * 235);
      image.data[offset] = image.data[offset + 1] = image.data[offset + 2] = value;
      image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

function ringCanvas() {
  const width = 1024, canvas = canvasOf(width, 8), context = canvas.getContext("2d")!, image = context.createImageData(width, 8);
  for (let x = 0; x < width; x++) {
    const t = x / width;
    // low enough band frequencies to stay clear of moiré once the ring is a few hundred pixels wide
    const banding = .3 + .26 * (Math.sin(t * 47) * .5 + .5) + .2 * (Math.sin(t * 19 + 1.7) * .5 + .5) + .3 * noise3(t * 34, 5.5, 2.5);
    const edges = THREE.MathUtils.smoothstep(t, 0, .09) * (1 - THREE.MathUtils.smoothstep(t, .82, 1));
    const divisions = 1 - .8 * Math.exp(-Math.pow((t - .44) / .035, 2)) - .5 * Math.exp(-Math.pow((t - .69) / .02, 2));
    const density = Math.max(0, banding * edges * divisions);
    const tint = THREE.MathUtils.clamp(banding, 0, 1);
    for (let y = 0; y < 8; y++) {
      const offset = (y * width + x) * 4;
      image.data[offset] = Math.round(mix(118, 198, tint)); image.data[offset + 1] = Math.round(mix(108, 188, tint)); image.data[offset + 2] = Math.round(mix(158, 226, tint));
      image.data[offset + 3] = Math.round(Math.min(1, density) * 205);
    }
  }
  context.putImageData(image, 0, 0);
  return canvas;
}

export function planetMaps(width: number): PlanetMaps {
  const cached = cache.get(width);
  if (cached) return cached;
  const height = width / 2;
  const { albedo, rough, normal } = planetSurface(width, height, terrain(width, height));
  const maps: PlanetMaps = {
    map: texture(albedo, true), roughnessMap: texture(rough, false), normalMap: texture(normal, false),
    clouds: texture(cloudCanvas(width / 2, height / 2), false), rings: texture(ringCanvas(), true),
  };
  cache.set(width, maps);
  return maps;
}

/** RingGeometry's default UVs are planar; remap u to the radial axis so a banded strip maps outward. */
export function ringGeometry(inner: number, outer: number, segments: number) {
  const geometry = new THREE.RingGeometry(inner, outer, segments, 1);
  const position = geometry.attributes.position, uv = geometry.attributes.uv;
  for (let i = 0; i < position.count; i++) {
    const radius = Math.hypot(position.getX(i), position.getY(i));
    uv.setXY(i, (radius - inner) / (outer - inner), 0);
  }
  uv.needsUpdate = true;
  return geometry;
}
