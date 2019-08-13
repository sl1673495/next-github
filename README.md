#### 项目的初始化

首先安装 create-next-app 脚手架

```
npm i -g create-next-app
```

然后利用脚手架建立 next 项目

```
create-next-app next-github
cd next-github
npm run dev
```

可以看到 pages 文件夹下的 index.js

```javascript
import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import Nav from '../components/nav'

const Home = () => (
  <div>
    <Head>
      <title>Home</title>
    </Head>
  </div>
)

export default Home
```

启动项目之后，默认端口启动在 3000 端口，

打开 localhost:3000 后，默认访问的就是 index.js 里的内容

把 next 作为 Koa 的中间件使用。

```javascript
const handle = app.getRequestHandler()
const server = new Koa()

server.use(async (ctx, next) => {
  await handle(ctx.req, ctx.res)
  ctx.respond = false
})
```

之所以要传递 ctx.req ctx.res，

是因为 next 并不只是兼容 koa 这个框架

所以需要传递 node 原生提供的 req 和 res

#### redis 的安装(windows)

在https://github.com/MicrosoftArchive/redis/releases 下载 msi 后缀的安装包

安装完成后在命令行进入到安装目录 然后.\redis-server.exe .\redis.windows.conf

.\redis-cli.exe 可以判断是否启动
