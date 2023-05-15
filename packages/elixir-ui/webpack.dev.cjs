/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const merge = require("webpack-merge");
const baseConfig = require("./webpack.common.cjs");

module.exports = merge(baseConfig, {
  devServer: {
    devMiddleware: {
      writeToDisk: true,
    },
    // open: true,
    // port: 3000,
  },
  target: "web",
  mode: "development",
  output: {
    filename: "[name].js",
    globalObject: "this",
    // libraryTarget: "umd",
  },
});
