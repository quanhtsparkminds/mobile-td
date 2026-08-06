const { getDefaultConfig } = require("@react-native/metro-config");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");
const { withNativeWind } = require("nativewind/metro");

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

module.exports = wrapWithReanimatedMetroConfig(
  withNativeWind(config, { input: "./global.css", inlineRem: 16 })
);
