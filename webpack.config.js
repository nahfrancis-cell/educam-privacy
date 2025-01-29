const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModulePathsToTranspile: ['@react-native', 'expo-linking', 'react-native-paper']
    }
  }, argv);

  // Remove existing DefinePlugin instances
  config.plugins = config.plugins.filter(plugin => !(plugin instanceof webpack.DefinePlugin));

  // Add a new DefinePlugin with merged environment variables
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
      __DEV__: process.env.NODE_ENV !== 'production',
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  );

  // Add resolve aliases and fallbacks
  config.resolve = {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      'react-native-paper': 'react-native-paper/lib/commonjs',
      'url': require.resolve('url/'),
    },
    fallback: {
      ...config.resolve.fallback,
      'url': require.resolve('url/'),
      'buffer': require.resolve('buffer/'),
      'crypto': require.resolve('crypto-browserify'),
      'stream': require.resolve('stream-browserify'),
      'path': require.resolve('path-browserify'),
    }
  };

  return config;
};
