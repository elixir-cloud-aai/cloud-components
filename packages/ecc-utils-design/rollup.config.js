// rollup.config.js
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import css from "rollup-plugin-import-css";

export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "es",
  },
  plugins: [
    nodeResolve(),
    css({
      output: "style.css",
    }),
    typescript(),
  ],
};
