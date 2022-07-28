import { combineReducers } from 'redux'
import reducer from './reducers/reducer'
import { connectRouter } from 'connected-react-router'

const createReducers = (history) =>
  combineReducers({
    app: reducer,
    router: connectRouter(history)
  })
export default createReducers
