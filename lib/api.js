const axios = require('axios')

const GITHUB_BASE_URL = 'https://api.github.com'

const isServer = typeof window === 'undefined'

// 服务端环境需要手动拼接url
async function requestGithub(method, url, data, headers) {
  if (!url) {
    throw new Error('url must be provided')
  }
  const result = await axios({
    method,
    url: `${GITHUB_BASE_URL}${url}`,
    data,
    headers,
  })

  return result
}

async function request(
  {
    method = 'GET',
    url,
    data = {},
  },
  req,
  res,
) {
  if (isServer) {
    const { session } = req
    const { githubAuth } = session || {}
    const { access_token, token_type } = githubAuth || {}
    const headers = {}
    if (access_token) {
      headers.Authorization = `${token_type} ${access_token}`
    }
    // 服务端走requestGithub方法，
    // 补全api的前缀
    const serverResult = await requestGithub(method, url, data, headers)
    return serverResult
  }

  // 客户端需要拼接github前缀 让koa的server可以识别并代理
  const clientResult = await axios({
    method,
    url: `/github${url}`,
    data,
  })
  return clientResult
}

module.exports = {
  request,
  requestGithub,
}
