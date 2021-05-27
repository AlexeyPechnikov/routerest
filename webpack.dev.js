const path = require("path");
const merge = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  devtool: "inline-source-map",
  // devServer: {
  //   contentBase: path.join(__dirname, "src"),
  //   contentBase: "./src",
  //   historyApiFallback: {
  //     index: "/"
  //   },
  //   proxy: {
  //     "/": "http://localhost:3000"
  //   }
  //   //host: "0.0.0.0"
  // }
});
