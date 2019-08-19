import React from 'react'
import initializeStore from '../store/store'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
  if (isServer) {
    // 服务端每次执行都重新创建一个store
    return initializeStore(initialState)
  }
  // 在客户端执行这个方法的时候 优先返回window上已有的store
  // 而不能每次执行都重新创建一个store 否则状态就无限重置了
  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState)
  }
  return window[__NEXT_REDUX_STORE__]
}

export default Comp => {
  class withReduxApp extends React.Component {
    constructor(props) {
      super(props)
      // getInitialProps创建了store 这里为什么又重新创建一次？
      // 因为服务端执行了getInitialProps之后 返回给客户端的是序列化后的字符串
      // redux里有很多方法 不适合序列化存储
      // 所以选择在getInitialProps返回initialReduxState初始的状态
      // 再在这里通过initialReduxState去创建一个完整的store
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      const { Component, pageProps, ...rest } = this.props
      return (
        <Comp
          {...rest}
          Component={Component}
          pageProps={pageProps}
          reduxStore={this.reduxStore}
        />
      )
    }
  }

  // 这个其实是_app.js的getInitialProps
  // 在服务端渲染和客户端路由跳转时会被执行
  // 所以非常适合做redux-store的初始化
  withReduxApp.getInitialProps = async ctx => {
    const reduxStore = getOrCreateStore()
    ctx.reduxStore = reduxStore

    let appProps = {}
    if (typeof Comp.getInitialProps === 'function') {
      appProps = await Comp.getInitialProps(ctx)
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    }
  }

  return withReduxApp
}
