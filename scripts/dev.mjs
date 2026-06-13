// Cross-platform dev launcher: builds the API server, then runs it alongside the
// website's Vite dev server. Used by the root `pnpm dev` script.
//
//   API  -> artifacts/api-server (port from its own .env, default 5000)
//   WEB  -> artifacts/psrao-website (PORT/BASE_PATH below; Vite proxies /api -> API)
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.join(root, "artifacts", "api-server");
const webDir = path.join(root, "artifacts", "psrao-website");

const run = (cmd, args, opts = {}) =>
  spawn(cmd, args, { stdio: "inherit", shell: true, ...opts });

console.log("[dev] building api-server...");
const build = run("node", ["build.mjs"], { cwd: apiDir });

build.on("exit", (code) => {
  if (code !== 0) {
    console.error(`[dev] api-server build failed (exit ${code})`);
    process.exit(code ?? 1);
  }

  console.log("[dev] starting api-server + website...");
  const api = run("node", ["--enable-source-maps", "dist/index.mjs"], {
    cwd: apiDir,
    env: { ...process.env, NODE_ENV: "development" },
  });
  const web = run("npx", ["vite"], {
    cwd: webDir,
    env: {
      ...process.env,
      PORT: process.env.PORT || "5190",
      BASE_PATH: process.env.BASE_PATH || "/",
    },
  });

  const stop = () => {
    api.kill();
    web.kill();
  };
  process.on("SIGINT", stop);
  process.on("SIGTERM", stop);
  // If either process dies, take the other down so the terminal isn't left half-running.
  api.on("exit", (c) => {
    web.kill();
    process.exit(c ?? 0);
  });
  web.on("exit", (c) => {
    api.kill();
    process.exit(c ?? 0);
  });
});
