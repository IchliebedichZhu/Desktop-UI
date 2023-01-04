import { defineConfig, rollup } from "rollup";
import { resolve as pathResolve } from "node:path";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import VueMacros from "unplugin-vue-macros";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import esbuild from "rollup-plugin-esbuild";

const input = [
  pathResolve(process.cwd(), "..", "packages", "components", "index.ts"),
];
console.log("input", input);
const config = defineConfig({
  input: input,
  plugins: [
    VueMacros.rollup({
      plugins: {
        vue: vue({
          include: [/\.vue$/, /setup\.[cm]?[jt]sx?$/],
          reactivityTransform: true,
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
