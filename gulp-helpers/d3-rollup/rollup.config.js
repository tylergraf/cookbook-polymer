import node from "rollup-plugin-node-resolve";

export default {
  entry: "lib/gulp-helpers/d3-rollup/d3.js",
  format: "iife",
  moduleName: "d3",
  plugins: [node()]
};
