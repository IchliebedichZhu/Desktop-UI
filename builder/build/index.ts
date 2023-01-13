import { defineConfig, rollup } from "rollup";
import { resolve as pathResolve } from "node:path";
import vueMacros from "unplugin-vue-macros/rollup";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import esbuild from "rollup-plugin-esbuild";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonJs from "@rollup/plugin-commonjs";

const input = [
  pathResolve(
    __dirname,
    "..",
    "..",
    "packages",
    "components",
    "Card",
    "src",
    "card.vue"
  ),
];
const outDir = pathResolve(
  __dirname,
  "..",
  "..",
  "dist",
  "desktop-ui",
  "components"
);

const getConfig = async () =>
  defineConfig({
    input,
    plugins: [
      vueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue(),
          vueJsx: vueJsx(),
        },
      }),
      nodeResolve({
        extensions: [".mjs", ".js", ".json", ".ts"],
      }),
      commonJs(),
      esbuild({
        target: "esnext",
        sourceMap: true,
        loaders: {
          ".vue": "ts",
        },
      }),
    ],
    external: ["vue"],
    treeshake: false,
  });

async function build() {
  const config = await getConfig();
  const bundle = await rollup(config);
  await bundle.write({
    dir: pathResolve(outDir, "es"),
    format: "es",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: pathResolve(
      __dirname,
      "..",
      "..",
      "packages",
      "components"
    ),
    entryFileNames: `[name].mjs`,
  });
  await bundle.write({
    dir: pathResolve(outDir, "lib"),
    exports: "named",
    format: "cjs",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: pathResolve(
      __dirname,
      "..",
      "..",
      "packages",
      "components"
    ),
    entryFileNames: `[name].js`,
  });
}

export default build;
