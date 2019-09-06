import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { message } from 'antd';
import axios from 'axios'

const LOGOUT = 'logout'

const userInitialState = {}

function userReducer(state = userInitialState, action) {
  switch (action.type) {
    case LOGOUT: {
      return {}
    }
    default:
      return state
  }
}

const allReducers = combineReducers({
  user: userReducer,
})

export function logout() {
  return (dispatch) => {
    axios.post('/logout')
      .then((resp) => {
        if (resp.status === 200) {
          dispatch({
            type: LOGOUT,
          })
          message.success('注销成功')
        } else {
          console.log('logout failed', resp)
        }
      })
      .catch((e) => {
        console.log('logout failed', e)
      })
  }
}

export default function initializeStore(state) {
  const store = createStore(
    allReducers,
    { ...userInitialState, ...state },
    composeWithDevTools(applyMiddleware(ReduxThunk)),
  )
  return store
}
