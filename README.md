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
server.use(async (ctx, next) => {
  await handle(ctx.req, ctx.res)
  ctx.respond = false
})
```
