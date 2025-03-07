const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add custom configuration
config.resolver.alias = {
    '@': path.resolve(__dirname, 'src'),
};

module.exports = config; 