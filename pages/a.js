import styled from 'styled-components'
import getConfig from 'next/config'
import dynamic from 'next/dynamic'

const Comp = dynamic(import('../components/Comp'))

const Title = styled.h1`
  color: yellow;
  font-size: 40px;
`
const A = ({ name, timeDiff }) => {
  return (
    <>
      <Title>这是A页面, 时间差是{timeDiff}</Title>
      动态组件：
      <Comp />
    </>
  )
}

A.getInitialProps = async ctx => {
  const moment = await import('moment')
  const timeDiff = moment.default(Date.now() - 60 * 1000).fromNow()
  return { timeDiff }
}

export default A
