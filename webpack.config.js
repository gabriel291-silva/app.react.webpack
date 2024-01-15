const path = require("path");
const autoprefixer = require("autoprefixer");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const isDevelopment = process.env.NODE_ENV !== "production";

// For our css modules these will be locally scoped
const CSSModuleLoader = {
  loader: "css-loader",
  options: {
    modules: true,
    importLoaders: 2,
    sourceMap: false, // turned off as causes delay
  },
};

// For our normal CSS files we would like them globally scoped
const CSSLoader = {
  loader: "css-loader",
  options: {
    modules: "global",
    importLoaders: 2,
    sourceMap: false, // turned off as causes delay
  },
};

// Our PostCSSLoader
const PostCSSLoader = {
  loader: "postcss-loader",
  options: {
    sourceMap: false, // turned off as causes delay
    postcssOptions: {
      plugins: [autoprefixer()],
    },
  },
};

// Standard style loader (prod and dev covered here)
const styleLoader = isDevelopment
  ? "style-loader"
  : MiniCssExtractPlugin.loader;

module.exports = {
  mode: isDevelopment ? "development" : "production",
  devtool: isDevelopment ? "eval-source-map" : "source-map",
  entry: "./index.js",
  output: {
    filename: "buildAppReact.js",
    path: path.resolve(__dirname, "..", "assets"),
  },
  resolve: {
    extensions: [".js", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.(j|t)(s|sx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /\.module\.(sa|sc|c)ss$/,
        use: [styleLoader, CSSLoader, PostCSSLoader, "sass-loader"],
      },
      {
        test: /\.module\.(sa|sc|c)ss$/,
        use: [styleLoader, CSSModuleLoader, PostCSSLoader, "sass-loader"],
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      insert: function (linkTag) {
        var reference = document.getElementById("buildAppReact");
        if (reference) {
          reference.parentNode.insertBefore(linkTag, reference);
        }
      },
      filename: "buildAppReact.css",
    }),
  ],
  watch: isDevelopment ? true : false,
};
