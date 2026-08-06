module.exports = {
  presets: ["module:@react-native/babel-preset", "nativewind/babel"],
  plugins: [
    [
      "babel-plugin-root-import",
      { root: __dirname, rootPathPrefix: "@/", rootPathSuffix: "src" },
    ],
    "react-native-reanimated/plugin",
  ],
};
