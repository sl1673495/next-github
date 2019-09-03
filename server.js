const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')
const session = require('koa-session')
const Redis = require('ioredis')
const auth = require('./server/auth')
const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
// 实例化一个redisClient
const redisClient = new Redis()
const PORT = 3001
// 等到pages目录编译完成后启动服务响应请求
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  // 用于给session加密
  server.keys = ['ssh develop github app']
  const sessionConfig = {
    // 设置到浏览器的cookie里的key
    key: 'sid',
    // 将自定义存储逻辑传给koa-session
    store: new RedisSessionStore(redisClient),
  }
  server.use(session(sessionConfig, server))

  // 处理github Oauth登录
  auth(server)

  router.get('/a/:id', async (ctx) => {
    const { id } = ctx.params
    await handle(ctx.req, ctx.res, {
      pathname: '/a',
      query: {
        id,
      },
    })
    ctx.respond = false
  })

  router.get('/api/user/info', async (ctx) => {
    const { userInfo } = ctx.session
    if (userInfo) {
      ctx.body = userInfo
      // 设置头部 返回json
      ctx.set('Content-Type', 'application/json')
    } else {
      ctx.status = 401
      ctx.body = 'Need Login'
    }
  })

  server.use(router.routes())

  server.use(async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(PORT, () => {
    console.log(`koa server listening on ${PORT}`)
  })
})
