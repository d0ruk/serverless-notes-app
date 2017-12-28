const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: slsw.lib.entries,
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js"
  },
  target: "node",
  devtool: "source-map",
  externals: [nodeExternals()],
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
      include: __dirname,
      exclude: /node_modules/
    }]
  }
};
