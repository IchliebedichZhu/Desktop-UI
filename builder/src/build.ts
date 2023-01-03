import { defineConfig, rollup } from "rollup";
import { resolve as pathResolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueMacros from "unplugin-vue-macros/rollup";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";

console.log(
  pathResolve(process.cwd(), "..", "packages", "components", "index.ts")
);

const config = defineConfig({
  input: pathResolve(process.cwd(), "..", "packages", "components", "index.ts"),
  output: {
    dir: pathResolve(process.cwd(), "..", "dist"),
  },
  plugins: [
    VueMacros({
      setupComponent: false,
      setupSFC: false,
      plugins: {
        vue: vue({
          isProduction: true,
        }),
        vueJsx: vueJsx(),
      },
    }),
    nodeResolve({
      extensions: [".mjs", ".js", ".json", ".ts"],
    }),
    commonjs(),
    esbuild({
      exclude: [],
      sourceMap: false,
      target: "es2018",
      loaders: {
        ".vue": "ts",
      },
      define: {
        "process.env.NODE_ENV": JSON.stringify("production"),
      },
      treeShaking: true,
      legalComments: "eof",
    }),
  ],
});

export default () => rollup(config);
