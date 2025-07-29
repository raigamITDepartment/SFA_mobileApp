const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Set a port that is less likely to be used by other processes.
config.server.port = 8088;

module.exports = config;