import { combineReducers } from 'redux'

import counterReducer from './userReducer.js'
export const rootReducer =combineReducers({
    userState: counterReducer,
  
})