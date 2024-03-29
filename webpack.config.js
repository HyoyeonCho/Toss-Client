const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  entry: ["./src/index.js"],
  output: {
    path: path.resolve(__dirname, "dist/"),
    publicPath: "/",
  },
  mode: "none",
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ["babel-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|ico)$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2|pdf)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {
            loader: "file-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "./index.html",
      favicon: "./public/favicon.ico", // favicon 설정
      hash: true,
    }),
    new webpack.DefinePlugin({
      "process.env.CLIENT_KEY": JSON.stringify(process.env.CLIENT_KEY),
      "process.env.SECRET_KEY": JSON.stringify(process.env.SECRET_KEY),
      "process.env.SERVER_IP": JSON.stringify(process.env.SERVER_IP),
      "process.env.SERVER_PORT": JSON.stringify(process.env.SERVER_PORT),
    }),
  ],
  devServer: {
    historyApiFallback: true,
    host: "0.0.0.0",
    port: "3000",
  },
};
