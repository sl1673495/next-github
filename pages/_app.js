import App, { Container } from 'next/app'
import Layout from '../components/Layout'
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
        <Layout>
          {/* 把pageProps解构后传递给组件 */}
          <Component {...pageProps} />
        </Layout>
      </Container>
    )
  }
}
