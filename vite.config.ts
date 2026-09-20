import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { sites } from "./build/sites-vite-plugin";

function staticHostingAdapter() {
  return {
    name: "static-hosting-adapter",
    apply: "build" as const,
    async closeBundle() {
      const directory = resolve(process.cwd(), "dist/server");
      await mkdir(directory, { recursive: true });
      await writeFile(resolve(directory, "index.js"), `export default { async fetch(request, env) { const response = await env.ASSETS.fetch(request); if (response.status !== 404 || new URL(request.url).pathname.includes(".")) return response; return env.ASSETS.fetch(new Request(new URL("/index.html", request.url), request)); } };`);
    },
  };
}

export default defineConfig({ plugins: [react(), staticHostingAdapter(), sites()] });
