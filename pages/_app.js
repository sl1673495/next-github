import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import React from 'react'
import { Provider } from 'react-redux'
import Layout from '../components/Layout'
import initializeStore from '../store/store'
import withRedux from '../lib/with-redux-app'
class MyApp extends App {
  // App组件的getInitialProps比较特殊
  // 能拿到一些额外的参数
  // Component: 被包裹的组件
  static async getInitialProps(ctx) {
    const { Component } = ctx
    let pageProps = {}

    // 拿到Component上定义的getInitialProps
    if (Component.getInitialProps) {
      // 执行拿到返回结果`
      pageProps = await Component.getInitialProps(ctx)
    }

    // 返回给组件
    return {
      pageProps,
    }
  }

  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Container>
        <Layout>
          <Provider store={reduxStore}>
            {/* 把pageProps解构后传递给组件 */}
            <Component {...pageProps} />
          </Provider>
        </Layout>
      </Container>
    )
  }
}

export default withRedux(MyApp)
