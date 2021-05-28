const path = require("path");
const webpack = require("webpack");

const backend = {
    entry: "./src/server.js",
    plugins: [
        new webpack.IgnorePlugin(/^pg-native$/)
    ],
  output: {
    path: path.join(__dirname, "build"),
    filename: "server.js"
  },
  target: "node",
  node:{
    __dirname: false,
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
      }
    }]
  },
  resolve: {
    extensions: ["*", ".js"]
  },
};

module.exports = backend;