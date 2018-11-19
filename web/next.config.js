/* @flow */
/* eslint-disable import/order */

let API_ENDPOINT = process.env.API_ENDPOINT;

export const nextConfig = {
  serverRuntimeConfig: Object.freeze({
    // Will only be available on the server side
    // mySecret: 'secret'
  }),
  publicRuntimeConfig: {
    // Will be available on both server and client
    staticFolder: '/static',
    apiEndpoint: API_ENDPOINT, // Pass through env variables
    peekKeysFromCurrentRoute: ['lng', 'host'],
    rewrites: [
      {
        path: '/products/:productId',
        page: 'product',
      },
    ],
  },
};

const withBundleAnalyzer =
  process.env.BUNDLE_ANALYZE != null
    ? require('@zeit/next-bundle-analyzer')
    : v => v;

module.exports = withBundleAnalyzer({
  pageExtensions: ['js'],

  ...nextConfig,
  // bundle analizer
  analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../.analyze/bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../.analyze/bundles/client.html',
    },
  },
});
