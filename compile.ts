import * as rollup from "rollup";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
/* var external = require("@yelo/rollup-node-external"); */

import { readdirSync } from "fs";
import { join, resolve } from "path";

(async () => {
  for (const pluginName of readdirSync("plugins")) {
    const input = resolve("plugins", pluginName, "main.ts");
    const outputDir = join("plugins", pluginName);
    const outputFile = resolve(outputDir, "dist.js");

    console.log(`Bundling ${input} -> ${outputFile}`);

    const bundle = await rollup.rollup({
      input,
      plugins: [typescript(), nodeResolve(), commonjs()],
    });

    await bundle.write({
      file: outputFile,
      format: "cjs",
    });
  }

  console.log("Build done");
  process.exit(0);
})();
