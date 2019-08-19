import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'

const initialState = {
  count: 0,
}

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'add':
      return {
        count: state.count + 1,
      }
      break

    default:
      return state
  }
}

export default function initializeStore(state) {
  const store = createStore(
    reducer,
    Object.assign({}, initialState, state),
    applyMiddleware(ReduxThunk)
  )
  return store
}
