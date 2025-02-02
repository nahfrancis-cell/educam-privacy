const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add any necessary resolver configurations
config.resolver = {
  ...config.resolver,
  sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json'],
};

// Configure server options to handle larger payloads
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Increase the limit to 50mb
      if (req.headers['content-type'] === 'application/json') {
        req.headers['content-length'] = '52428800'; // 50MB in bytes
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;
