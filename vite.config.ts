import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
// vitest/config re-exports Vite's defineConfig with the `test` option typed.
import { defineConfig } from "vitest/config";
import { viteSingleFile } from "vite-plugin-singlefile";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/**
 * Dev proxy (Block 6): the browser only ever talks to THIS origin — `/api/*`
 * is forwarded to alankar-backend server-side. Benefits:
 *   - no CORS preflight dance in development
 *   - the admin httpOnly cookie stays same-origin (withCredentials just works)
 *   - works behind tunnelled/preview hosts where "localhost:5001" from the
 *     browser would point at the wrong machine
 * Set VITE_API_BASE_URL=/api in .env to use it (default in .env.sample), or
 * point VITE_API_BASE_URL straight at the deployed API for production builds.
 */
const API_PROXY_TARGET = process.env.ALANKAR_API_PROXY_TARGET || "http://127.0.0.1:5001";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), viteSingleFile()],
  // Vitest reads this config too. Default env is `node` (fast, for the pure
  // message-builder test); component tests opt into jsdom per-file with the
  // `@vitest-environment jsdom` docblock.
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    globals: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 5173,
    // Allow sandbox/tunnel preview hosts (e.g. https://5173-xyz.e2b.app).
    allowedHosts: [".e2b.app", ".localhost"],
    proxy: {
      "/api": {
        target: API_PROXY_TARGET,
        changeOrigin: true,
        // /api/products → /v1/products
        rewrite: (p) => p.replace(/^\/api/, "/v1"),
        // Strip the browser Origin so the backend CORS allowlist does not need
        // to know every dev/preview host; same-origin via the proxy anyway.
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq) => {
            proxyReq.removeHeader("origin");
          });
        },
      },
    },
  },
});
