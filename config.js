const GITHUB_OAUTH_URL = 'https://github.com/login/oauth/authorize'
const SCOPE = 'user'

const github = {
  request_token_url: 'https://github.com/login/oauth/access_token',
  client_id: '6a1ff2700790b55ade14',
  client_secret: 'bddc92e3fc965fc285dd8b4e98bdd58640791b2c',
}

module.exports = {
  github,
  GITHUB_OAUTH_URL,
  OAUTH_URL: `${GITHUB_OAUTH_URL}?client_id=${github.client_id}&scope=${SCOPE}`,
}
