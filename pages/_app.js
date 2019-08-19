import App, { Container } from 'next/app'
import 'antd/dist/antd.css'
import React from 'react'
import { Provider } from 'react-redux'
import Layout from '../components/Layout'
import initializeStore from '../store/store'
import withRedux from '../lib/with-redux-app'
class MyApp extends App {
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
