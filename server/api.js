const { requestGithub } = require('../lib/api')

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const { path, url, method } = ctx

    const proxyPrefix = '/github/'
    if (path.startsWith(proxyPrefix)) {
      const { session } = ctx
      const { githubAuth } = session || {}
      const { access_token, token_type } = githubAuth || {}
      const headers = {}
      if (access_token) {
        headers.Authorization = `${token_type} ${access_token}`
      }
      const result = await requestGithub(
        method,
        url.replace('/github/', '/'),
        ctx.request.body,
        headers,
      )
      ctx.status = result.status
      ctx.body = result.data
    } else {
      await next()
    }
  })
}
