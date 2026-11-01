import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

function interpolate(content: string, env: Record<string, string>): string {
  return content.replace(/%([A-Z0-9_]+)%/g, (match, key: string) => {
    return Object.hasOwn(env, key) ? env[key] : match;
  });
}

export function htmlEnvPlugin(env: Record<string, string>): Plugin {
  return {
    name: "html-env",
    transformIndexHtml(html) {
      return interpolate(html, env);
    },
  };
}

export function manifestEnvPlugin(env: Record<string, string>): Plugin {
  return {
    name: "manifest-env",
    closeBundle() {
      const file = path.resolve("dist/manifest.json");

      if (!fs.existsSync(file)) {
        return;
      }

      const next = interpolate(fs.readFileSync(file, "utf8"), env);
      fs.writeFileSync(file, next);
    },
  };
}

export function copyEnvAssetsPlugin(viteEnv: string) {
  return viteStaticCopy({
    targets: [
      {
        src: `env/${viteEnv}/*`,
        dest: ".",
      },
    ],
  });
}

export function metaJsonPlugin(version: string): Plugin {
  return {
    name: "meta-json",
    buildStart() {
      const meta = {
        version,
        timestamp: new Date().toISOString(),
      };

      fs.mkdirSync("public", { recursive: true });
      fs.writeFileSync("public/meta.json", `${JSON.stringify(meta, null, 2)}\n`);
    },
  };
}
