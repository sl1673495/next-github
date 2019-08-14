const withCss = require('@zeit/next-css')

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}

// withCss得到的是一个nextjs的config配置
module.exports = withCss({})
