## 项目的初始化

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

生成的目录结构很简单，我们稍微加几个内容

```
├── README.md
├── components // 非页面级共用组件
│   └── nav.js
├── package-lock.json
├── package.json
├── pages // 页面级组件 会被解析成路由
│   └── index.js
├── lib // 一些通用的js
├── static // 静态资源
│   └── favicon.ico

```

启动项目之后，默认端口启动在 3000 端口，打开 localhost:3000 后，默认访问的就是 index.js 里的内容

## 把 next 作为 Koa 的中间件使用。

在根目录新建 server.js 文件

```js
// server.js

const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = 3001
// 等到pages目录编译完成后启动服务响应请求
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  server.use(async (ctx, next) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(PORT, () => {
    console.log(`koa server listening on ${PORT}`)
  })
})
```

然后把`package.json`中的`dev`命令改掉

```
scripts": {
  "dev": "node server.js",
  "build": "next build",
  "start": "next start"
}
```

`ctx.req`和`ctx.res` 是 node 原生提供的

之所以要传递 `ctx.req`和`ctx.res`，是因为 next 并不只是兼容 koa 这个框架，所以需要传递 node 原生提供的 `req` 和 `res`

## redis 的安装

### windows

在 https://github.com/MicrosoftArchive/redis/releases 下载 msi 后缀的安装包

安装完成后在命令行进入到安装目录 然后.\redis-server.exe .\redis.windows.conf

.\redis-cli.exe 可以判断是否启动

### mac

`brew install redis`  
命令 `redis-server` 可以检测是否启动成功  
命令 `redis-cli` 可以进入 redis 操作

## redis 基础操作

`KEYS *` 获取所有存储的 key  
`set a 1` 设置 key 为 a，value 为 1  
`get a` 获取 key 为 a 的 value  
`DEL a` 删除 key a  
`setex c 10 1` 设置 key 为 c，value 为 1 10 秒以后过期

## nodejs 连接 redis

使用 `ioredis` 这个包，其性能据说比官方 redis sdk 还要高

执行`yarn add ioredis`

使用示例：

```
const Redis = require('ioredis')

const redis = new Redis({
  port: 6379
  password: ''
})
```

port 和 password 的默认值就是上面写的参数，所以如果用默认端口和密码可以不填，这个我们后面用到 redis 再说

## 集成 css

next 中默认不支持直接 import css 文件，它默认为我们提供了一种 css in js 的方案，所以我们要自己加入 next 的插件包进行 css 支持

```
yarn add @zeit/next-css
```

如果项目根目录下没有的话  
我们新建一个`next.config.js`  
然后加入如下代码

```js
const withCss = require('@zeit/next-css')

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}

// withCss得到的是一个next的config配置
module.exports = withCss({})
```

## 集成 ant-design

```
yarn add antd
yarn add babel-plugin-import // 按需加载插件
```

在根目录下新建`.babelrc`文件

```
{
  "presets": ["next/babel"],
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd"
      }
    ]
  ]
}
```

这个 babel 插件的作用是把

```
import { Button } from 'antd'
```

解析成

```
import Button from 'antd/lib/button'
```

这样就完成了按需引入组件

在 pages 文件夹下新建`_app.js`，这是 next 提供的让你重写 App 组件的方式，在这里我们可以引入 antd 的样式

pages/\_app.js

```js
import App from 'next/app'

import 'antd/dist/antd.css'

export default App
```

## next 中的路由

### 利用`Link`组件进行跳转

```js
import Link from 'next/link'
import { Button } from 'antd'

const LinkTest = () => (
  <div>
    <Link href="/a">
      <Button>跳转到a页面</Button>
    </Link>
  </div>
)

export default LinkTest
```

### 利用`Router`模块进行跳转

```js
import Link from 'next/link'
import Router from 'next/router'
import { Button } from 'antd'

export default () => {
  const goB = () => {
    Router.push('/b')
  }

  return (
    <>
      <Link href="/a">
        <Button>跳转到a页面</Button>
      </Link>
      <Button onClick={goB}>跳转到b页面</Button>
    </>
  )
}
```

### 动态路由

在 next 中，只能通过`query`来实现动态路由，不支持`/b/:id` 这样的定义方法

首页

```js
import Link from 'next/link'
import Router from 'next/router'
import { Button } from 'antd'

export default () => {
  const goB = () => {
    Router.push('/b?id=2')
    // 或
    Router.push({
      pathname: '/b',
      query: {
        id: 2,
      },
    })
  }

  return <Button onClick={goB}>跳转到b页面</Button>
}
```

B 页面

```js
import { withRouter } from 'next/router'

const B = ({ router }) => <span>这是B页面, 参数是{router.query.id}</span>
export default withRouter(B)
```

此时跳转到 b 页面的路径是`/b?id=2`

如果真的想显示成`/b/2`这种形式的话， 也可以通过`Link`上的`as`属性来实现

```js
<Link href="/a?id=1" as="/a/1">
  <Button>跳转到a页面</Button>
</Link>
```

或在使用`Router`时

```js
Router.push(
  {
    pathname: '/b',
    query: {
      id: 2,
    },
  },
  '/b/2'
)
```

但是使用这种方法，在页面刷新的时候会 404  
是因为这种别名的方法只是在前端路由跳转的时候加上的  
刷新时请求走了服务端就认不得这个路由了

### 使用 koa 可以解决这个问题

```js
// server.js

const Koa = require('koa')
const Router = require('koa-router')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const PORT = 3001
// 等到pages目录编译完成后启动服务响应请求
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router()

  // start
  // 利用koa-router去把/a/1这种格式的路由
  // 代理到/a?id=1去，这样就不会404了
  router.get('/a/:id', async ctx => {
    const id = ctx.params.id
    await handle(ctx.req, ctx.res, {
      pathname: '/a',
      query: {
        id,
      },
    })
    ctx.respond = false
  })
  server.use(router.routes())
  // end

  server.use(async (ctx, next) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })

  server.listen(PORT, () => {
    console.log(`koa server listening on ${PORT}`)
  })
})
```

### Router 的钩子

在一次路由跳转中，先后会触发  
`routeChangeStart`  
`beforeHistoryChange`  
`routeChangeComplete`

如果有错误的话，则会触发  
`routeChangeError`

监听的方式是

```js
Router.events.on(eventName, callback)
```

## 自定义 document

- 只有在服务端渲染的时候才会被调用
- 用来修改服务端渲染的文档内容
- 一般用来配合第三方 css in js 方案使用

在 pages 下新建\_document.js，我们可以根据需求去重写。

```js
import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  // 如果要重写render 就必须按照这个结构来写
  render() {
    return (
      <Html>
        <Head>
          <title>ssh-next-github</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
```

## 自定义 app

next 中，pages/\_app.js 这个文件中暴露出的组件会作为一个全局的包裹组件，会被包在每一个页面组件的外层，我们可以用它来

- 固定 Layout
- 保持一些共用的状态
- 给页面传入一些自定义数据
  pages/\_app.js

给个简单的例子，先别改\_app.js 里的代码，否则接下来 getInitialProps 就获取不到数据了，这个后面再处理。

```js
import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import React from 'react'

export default class MyApp extends App {
  render() {
    // Component就是我们要包裹的页面组件
    const { Component } = this.props
    return (
      <Container>
        <Component />
      </Container>
    )
  }
}
```

## 封装 getInitialProps

`getInitialProps` 的作用非常强大，它可以帮助我们同步服务端和客户端的数据，我们应该尽量把数据获取的逻辑放在 `getInitialProps` 里，它可以：

- 在页面中获取数据
- 在 App 中获取全局数据

### 基本使用

通过 `getInitialProps` 这个静态方法返回的值 都会被当做 props 传入组件

```js
const A = ({ name }) => (
  <span>这是A页面, 通过getInitialProps获得的name是{name}</span>
)

A.getInitialProps = () => {
  return {
    name: 'ssh',
  }
}
export default A
```

但是需要注意的是，只有 pages 文件夹下的组件（页面级组件）才会调用这个方法。next 会在路由切换前去帮你调用这个方法，这个方法在服务端渲染和客户端渲染都会执行。（`刷新` 或 `前端跳转`)  
并且如果服务端渲染已经执行过了，在进行客户端渲染时就不会再帮你执行了。

### 异步场景

异步场景可以通过 async await 来解决，next 会等到异步处理完毕 返回了结果后以后再去渲染页面

```js
const A = ({ name }) => (
  <span>这是A页面, 通过getInitialProps获得的name是{name}</span>
)

A.getInitialProps = async () => {
  const result = Promise.resolve({ name: 'ssh' })
  await new Promise(resolve => setTimeout(resolve, 1000))
  return result
}
export default A
```

### 在\_app.js 里获取数据

我们重写一些\_app.js 里获取数据的逻辑

```js
import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import React from 'react'

export default class MyApp extends App {
  // App组件的getInitialProps比较特殊
  // 能拿到一些额外的参数
  // Component: 被包裹的组件
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    // 拿到Component上定义的getInitialProps
    if (Component.getInitialProps) {
      // 执行拿到返回结果
      pageProps = await Component.getInitialProps(ctx)
    }

    // 返回给组件
    return {
      pageProps,
    }
  }

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        {/* 把pageProps解构后传递给组件 */}
        <Component {...pageProps} />
      </Container>
    )
  }
}
```

## 封装通用 Layout

我们希望每个页面跳转以后，都可以有共同的头部导航栏，这就可以利用\_app.js 来做了。

在 components 文件夹下新建 Layout.jsx：

```js
import Link from 'next/link'
import { Button } from 'antd'

export default ({ children }) => (
  <header>
    <Link href="/a">
      <Button>跳转到a页面</Button>
    </Link>
    <Link href="/b">
      <Button>跳转到b页面</Button>
    </Link>
    <section className="container">{children}</section>
  </header>
)
```

在\_app.js 里

```jsx
// 省略
import Layout from '../components/Layout'

export default class MyApp extends App {
  // 省略

  render() {
    const { Component, pageProps } = this.props
    return (
      <Container>
        {/* Layout包在外面 */}
        <Layout>
          {/* 把pageProps解构后传递给组件 */}
          <Component {...pageProps} />
        </Layout>
      </Container>
    )
  }
}
```

## document title 的解决方案

例如在 pages/a.js 这个页面中，我希望网页的 title 是 a，在 b 页面中我希望 title 是 b，这个功能 next 也给我们提供了方案

pages/a.js

```js
import Head from 'next/head'

const A = ({ name }) => (
  <>
    <Head>
      <title>A</title>
    </Head>
    <span>这是A页面, 通过getInitialProps获得的name是{name}</span>
  </>
)

export default A
```

## 样式的解决方案（css in js）

next 默认采用的是 styled-jsx 这个库  
https://github.com/zeit/styled-jsx

需要注意的点是：组件内部的 style 标签，只有在组件渲染后才会被加到 head 里生效，组件销毁后样式就失效。

### 组件内部样式

next 默认提供了样式的解决方案，在组件内部写的话默认的作用域就是该组件，写法如下：

```js
const A = ({ name }) => (
  <>
    <span className="link">这是A页面</span>
    <style jsx>
      {`
        .link {
          color: red;
        }
      `}
    </style>
  </>
)

export default A
)
```

我们可以看到生成的 span 标签变成了

```jsx
<span class="jsx-3081729934 link">这是A页面</span>
```

生效的 css 样式变成了

```css
.link.jsx-3081729934 {
  color: red;
}
```

通过这种方式做到了组件级别的样式隔离，并且 link 这个 class 假如在全局有定义样式的话，也一样可以得到样式。

### 全局样式

```jsx
<style jsx global>
  {`
    .link {
      color: red;
    }
  `}
</style>
```
