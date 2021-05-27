const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
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
  externals: ["sqlite3", "mysql2", "mssql", "tedious", "sqlite", "mysql", "le-challenge-dns", "le-challenge-ddns"],
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