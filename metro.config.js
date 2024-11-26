const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

// const config = {};

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
const defaultConfig = getDefaultConfig(__dirname);

const config = {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
    assetExts: defaultConfig.resolver.assetExts.filter(ext => ext !== 'svg'),
  },
};

module.exports = mergeConfig(defaultConfig, config);
