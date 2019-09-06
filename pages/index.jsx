import { Button, Icon, Tabs } from 'antd'
import getConfig from 'next/config'
import Router, { withRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { request } from '../lib/api'
import initCache from '../lib/client-cache'
import Repo from '../components/Repo'

const { publicRuntimeConfig } = getConfig()

const { cache, useCache } = initCache()

const Index = ({ userRepos, starred, router }) => {
  const user = useSelector((store) => store.user)
  const tabKey = router.query.key || '1'

  useCache({
    userRepos,
    starred,
  })

  if (!user || !user.id) {
    return (
      <div className="root">
        <p>亲，您还没有登录哦</p>
        <Button type="primary" href={publicRuntimeConfig.OAUTH_URL}>
          点击登录
        </Button>
        <style jsx>
          {`
            .root {
              height: 400px;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
          `}
        </style>
      </div>
    )
  }

  const {
    avatar_url, login, name, bio, email,
  } = user

  const handleTabChange = (activeKey) => {
    Router.push(`/?key=${activeKey}`)
  }

  return (
    <div className="root">
      <div className="user-info">
        <img src={avatar_url} alt="" className="avatar" />
        <span className="login">{login}</span>
        <span className="name">{name}</span>
        <span className="bio">{bio}</span>
        <p className="email">
          <Icon type="mail" className="icon-email" />
          <a href={`mailto:${email}`}>{email}</a>
        </p>
      </div>
      <div className="user-repos">
        <Tabs activeKey={tabKey} onChange={handleTabChange} animated={false}>
          <Tabs.TabPane tab="你的仓库" key="1">
            {userRepos.map((repo) => (
              <Repo key={repo.id} repo={repo} />
            ))}
          </Tabs.TabPane>
          <Tabs.TabPane tab="你关注的仓库" key="2">
            {starred.map((repo) => (
              <Repo key={repo.id} repo={repo} />
            ))}
          </Tabs.TabPane>
        </Tabs>
      </div>
      <style jsx>
        {`
          .root {
            display: flex;
            align-items: flex-start;
            padding: 20px 0;
          }

          .user-info {
            flex-shrink: 0;
            display: flex;
            flex-direction: column;
            width: 200px;
            margin-right: 40px;
          }

          .login {
            font-weight: 800;
            font-size: 20px;
            margin-top: 20px;
          }

          .name {
            font-size: 16px;
            color: #777;
          }

          .bio {
            margin-top: 20px;
            color: #333;
          }

          .avatar {
            width: 100%;
            border-radius: 5px;
          }

          .user-repos {
            flex: 1;
          }

          :global(.icon-email) {
            margin-right: 10px;
          }
        `}
      </style>
    </div>
  )
}

Index.getInitialProps = cache(async ({ ctx, reduxStore }) => {
  const { user } = reduxStore.getState()
  if (!user || !user.id) {
    return {}
  }

  const { data: userRepos } = await request(
    {
      url: '/user/repos',
    },
    ctx.req,
    ctx.res,
  )

  const { data: starred } = await request(
    {
      url: '/user/starred',
    },
    ctx.req,
    ctx.res,
  )
  return {
    userRepos,
    starred,
  }
})

export default withRouter(Index)
