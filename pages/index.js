import { connect } from 'react-redux'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()
const Index = ({ count, add }) => (
  <>
    <span>
      首页 state的count是
      {count}
    </span>
    <button onClick={add}>增加</button>
    <a href={publicRuntimeConfig.OAUTH_URL}>去登陆</a>
  </>
)

Index.getInitialProps = async ({ reduxStore }) => {
  console.log('reduxStore: ', reduxStore)
  reduxStore.dispatch({ type: 'add' })
  return {}
}

function mapStateToProps(state) {
  const { count } = state
  return {
    count,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    add() {
      dispatch({ type: 'add' })
    },
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Index)
