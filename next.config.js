const withCss = require('@zeit/next-css')
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer')
const webpack = require('webpack')
const config = require('./config')

if (typeof require !== 'undefined') {
  require.extensions['.css'] = () => {}
}

const { GITHUB_OAUTH_URL } = config
// withCss得到的是一个nextjs的config配置
module.exports = withBundleAnalyzer(withCss({
  webpack(webpackConfig) {
    webpackConfig.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
    return webpackConfig
  },
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL,
    OAUTH_URL: config.OAUTH_URL,
  },
  analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
  bundleAnalyzerConfig: {
    server: {
      analyzerMode: 'static',
      reportFilename: '../bundles/server.html',
    },
    browser: {
      analyzerMode: 'static',
      reportFilename: '../bundles/client.html',
    },
  },
}))
