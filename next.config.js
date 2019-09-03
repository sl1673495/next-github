const withCss = require('@zeit/next-css')
const config = require('./config')

if (typeof require !== 'undefined') {
  require.extensions['.css'] = (file) => {}
}

const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'
// withCss得到的是一个nextjs的config配置
module.exports = withCss({
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL,
    OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${config.github.client_id}&scope=${SCOPE}`,
  },
})
