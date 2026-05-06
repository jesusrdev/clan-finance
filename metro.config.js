const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require("uniwind/metro");

const config = getDefaultConfig(__dirname);

config.resolver.blockList = /.*\.(test|spec)\.(js|jsx|ts|tsx)$/;

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./src/global.css",
  dtsFile: "./src/uniwind-types.d.ts",
  debug: true,
  extraThemes: [
    "onePiece",
    "demonSlayer",
    "naruto",
    "dragonBall",
    "strangerThings",
  ],
});
